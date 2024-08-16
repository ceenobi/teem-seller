import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  Page,
  Texts,
} from "@/components";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useNavigation } from "react-router-dom";
import { Form, Col, Row, Image, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { handleError, validateFields } from "@/utils";
import { FaImage } from "react-icons/fa";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { categoryService } from "@/api";
import { useStore } from "@/hooks";
import { Helmet } from "react-helmet-async";
import SimpleMDE from "react-simplemde-editor";

const Add = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const { merchant, token, setGetCategories, getCategories } = useStore();

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

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await categoryService.createCategory(
        merchant?.merchantCode,
        formData,
        token
      );
      if (status === 201) {
        toast.success(data.msg);
        setGetCategories([data.category, ...getCategories]);
        navigate("/categories");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add a category for your products</title>
        <meta
          name="description"
          content="Adding a category helps find your products easier."
        />
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
        <Headings text="Add category" size="1.5rem" />
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
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <>
                        <SimpleMDE
                          placeholder="Description"
                          {...field}
                          isInvalid={!!errors.description}
                        />
                        <Form.Text id="description" muted className="fw-bold">
                          A description about your category.
                        </Form.Text>
                        <br />
                        <span
                          type="invalid"
                          className="text-start text-danger small"
                        >
                          {errors.description ? errors.description.message : ""}
                        </span>
                      </>
                    )}
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
                      {...register("image", { required: true })}
                      accept="image/*"
                      className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                      onChange={handleImage}
                    />
                    {errors?.image?.type === "required" ? (
                      <span className="text-start text-danger small">
                        Please select an image
                      </span>
                    ) : null}
                  </div>
                  {selectedImage && (
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
              </Col>
            </Row>
          </Form>
        )}
      </Page>
    </>
  );
};

export default Add;
