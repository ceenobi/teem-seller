import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  Page,
  Texts,
  ModalBox,
} from "@/components";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useLoaderData, useNavigation } from "react-router-dom";
import { Form, Col, Row, Image, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { handleError, validateFields } from "@/utils";
import { FaImage } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { categoryService } from "@/api";
import { useStore } from "@/hooks";
import { RiErrorWarningLine } from "react-icons/ri";
import { Helmet } from "react-helmet-async";

const Edit = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { merchant, token, setGetCategories } = useStore();
  const { data } = useLoaderData();
  const categoryDetail = useMemo(() => data, [data]);

  useEffect(() => {
    if (categoryDetail) {
      setValue("name", categoryDetail?.name);
      setValue("image", categoryDetail?.image);
      setValue("description", categoryDetail?.description);
    }
  }, [categoryDetail, setValue]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
    }
  };

  const deleteACategory = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await categoryService.deleteCategory(
        merchant.merchantCode,
        categoryDetail._id,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetCategories((prevData) => {
          const filteredCategories = prevData.filter(
            (category) => category._id !== categoryDetail?._id
          );
          return [
            ...filteredCategories.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/categories");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onFormSubmit = async (formData) => {
    const credentials = {
      image: selectedImage,
      name: formData.name,
      description: formData.description,
    };
    try {
      const { status, data } = await categoryService.updateACategory(
        merchant.merchantCode,
        categoryDetail._id,
        credentials,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetCategories((prevData) => {
          const updatedCategories = [
            ...prevData.filter(
              (category) => category._id !== data.updatedCategory._id
            ),
            data.updatedCategory,
          ];
          return [
            ...updatedCategories.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/categories");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit {categoryDetail?.name}</title>
        <meta name="description" content="Edit category" />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack /> Categories
            </>
          }
          size="1rem"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate(-1)}
        />
        <Headings text="Edit category" size="1.5rem" />
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
              <Col md={6} lg={7} xl={8}>
                <CardBox>
                  <Texts text="DETAILS" size="12px" className="fw-bold" />
                  <FormInputs
                    type="text"
                    id="name"
                    label="Name"
                    placeholder="Enter category name"
                    className="w-100 mb-3"
                    name="name"
                    register={register}
                    validateFields={validateFields?.name}
                    errors={errors.name}
                  />
                  <FormInputs
                    as="textarea"
                    id="description"
                    label="Description"
                    placeholder="Add a little description"
                    className="w-100 mb-3"
                    name="description"
                    register={register}
                    validateFields={validateFields?.description}
                    errors={errors.description}
                    rows="6"
                  />
                </CardBox>
                <CardBox>
                  <Texts text="IMAGE" size="12px" className="fw-bold" />
                  <div className="rounded-1 bg-secondary-subtle p-4 position-relative">
                    <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm">
                      <FaImage />
                      <span>
                        {selectedImage ? "Change Image" : "Upload Image"}
                      </span>
                    </div>
                    <Form.Control
                      type="file"
                      id="image"
                      name="image"
                      {...register("image")}
                      accept="image/*"
                      className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                      onChange={handleImage}
                    />
                  </div>
                  {selectedImage ? (
                    <div
                      className="mt-2 position-relative"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <Image
                        src={selectedImage}
                        alt="category image preview"
                        style={{ width: "60px", height: "60px" }}
                        className="mt-3 me-2"
                      />
                      <IoCloseCircle
                        className="position-absolute top-25 cursor"
                        size="25px"
                        onClick={() => setSelectedImage(null)}
                      />
                    </div>
                  ) : (
                    <Image
                      src={categoryDetail?.image}
                      alt={categoryDetail?.name}
                      style={{ width: "60px", height: "60px" }}
                      className="mt-3"
                    />
                  )}
                </CardBox>
              </Col>
              <Col md={5} xl={4}>
                <CardBox>
                  <ActionButton
                    text="Save changes"
                    className="mt-3 w-100 btns"
                    type="submit"
                    pending={isSubmitting}
                    disabled={isSubmitting}
                  />
                </CardBox>
                <CardBox>
                  <Texts
                    text="DELETE CATEGORY"
                    className="fw-bold"
                    size="12px"
                  />
                  <Texts
                    text="DELETE CATEGORY"
                    className="text-center fw-bold bg-danger p-2 text-white cursor"
                    size="12px"
                    onClick={() => setShowModal(true)}
                  />
                  <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                    <RiErrorWarningLine color="red" size="30px" />
                    <span className="small">
                      Deleting your category is permanent and cannot be
                      reversed.
                    </span>
                  </div>
                </CardBox>
              </Col>
            </Row>
          </Form>
        )}
        <ModalBox
          show={showModal}
          handleClose={() => setShowModal(false)}
          title="Delete category"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete your category"
            className="fw-bold"
          />
          <Texts text="Deleting your category is permanent and cannot be reversed. Are you sure?" />
          <div className="d-flex justify-content-end align-items-center gap-3">
            <ActionButton
              text="Cancel"
              variant="secondary"
              onClick={() => setShowModal(false)}
              size="sm"
            />
            <ActionButton
              text="DELETE"
              pending={isDeleting}
              disabled={isDeleting}
              className="bg-danger w-25"
              onClick={deleteACategory}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default Edit;
