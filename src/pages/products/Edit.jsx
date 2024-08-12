import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  ModalBox,
  Page,
  Texts,
} from "@/components";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Form, Row, Col, Badge, Alert, Image, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaToggleOn, FaToggleOff, FaCloudUploadAlt } from "react-icons/fa";
import { handleError, validateFields } from "@/utils";
import { useFetch, useStore } from "@/hooks";
import { categoryService, productService } from "@/api";
import { IoCloseCircle } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

const Edit = () => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { merchant, token, setGetProducts } = useStore();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    data: categories,
    error,
    isLoading,
  } = useFetch(categoryService.getAllCategories, merchant.merchantCode);
  const categoryDetail = useMemo(() => categories, [categories]);
  const { data: product } = useLoaderData();
  const productDetail = useMemo(() => product, [product]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (productDetail) {
      setValue("name", productDetail.name);
      setValue("slug", productDetail.slug);
      setValue("description", productDetail.description);
      setValue("brand", productDetail.brand);
      setValue("price", productDetail.price);
      setValue("category", productDetail.category);
      setValue("isActive", productDetail.isActive);
      setValue("inStock", productDetail.inStock);
      setValue("image", productDetail.image);
      setValue("condition", productDetail.condition);
    }
  }, [productDetail, setValue]);

  const productNameValue = watch("name");

  function generateSlug() {
    if (!productNameValue) {
      toast.warning("Enter the product name to generate product slug");
      return;
    }
    const getSlug = productNameValue.split(" ").join("-").toLowerCase();
    setValue("slug", getSlug);
  }

  const handleImage = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files && e.target.files[i]) {
        if (e.target.files[i].size > 2 * 1000 * 1000) {
          toast.error("File with maximum size of 2MB is allowed");
          return false;
        }
        transformImage(e.target.files);
      }
    }
  };

  const transformImage = (files) => {
    let images = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        images.push(reader.result);
        setSelectedImage(images);
        setValue("image", images);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const deleteAProduct = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await productService.deleteProduct(
        merchant.merchantCode,
        productDetail._id,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetProducts((prevData) => {
          const filteredProducts = prevData.filter(
            (product) => product._id !== productDetail?._id
          );
          return [
            ...filteredProducts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/products");
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
      category: formData.category,
      price: formData.price,
      slug: formData.slug,
      brand: formData.brand,
      isActive: formData.isActive,
      inStock: formData.inStock,
      condition: formData.condition,
    };
    try {
      const { status, data } = await productService.updateProduct(
        merchant.merchantCode,
        productDetail._id,
        credentials,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetProducts((prevData) => {
          const updatedProducts = [
            ...prevData.filter(
              (product) => product._id !== data.updatedProduct._id
            ),
            data.updatedProduct,
          ];
          return [
            ...updatedProducts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/products");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Product - {productDetail.name}</title>
        <meta name="description" content="Edit details about this poduct" />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack />
              Products
            </>
          }
          size="16px"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/products")}
        />
        <Headings text="Edit Product" size="1.5rem" />
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
                    name="name"
                    label="Name (required)"
                    register={register}
                    validateFields={validateFields?.name}
                    errors={errors.name}
                    placeholder="Enter category name"
                    className="mb-3 w-100"
                  />
                  <div className="mb-3 gap-2 align-items-center">
                    <div className="position-relative w-100">
                      <FormInputs
                        type="text"
                        id="slug"
                        name="slug"
                        label="Slug (required)"
                        register={register}
                        validateFields={validateFields?.slug}
                        errors={errors.slug}
                        placeholder="Enter slug"
                        className="w-100 mb-3"
                      />
                      <Badge
                        bg="dark"
                        text="light"
                        className="p-2 position-absolute top-50 end-0 translate-middle cursor"
                        role="button"
                        onClick={generateSlug}
                      >
                        REGENERATE
                      </Badge>
                    </div>
                    <FormInputs
                      type="text"
                      id="brand"
                      name="brand"
                      label="Brand"
                      register={register}
                      placeholder="Enter brand"
                      className="w-100"
                    />
                  </div>
                  <div className="mb-3">
                    <Texts text="DESCRIPTION" size="12px" className="fw-bold" />
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
                    />
                  </div>
                </CardBox>
                <CardBox>
                  <Texts text="PRICE" size="12px" className="fw-bold" />
                  <div className="d-xl-flex gap-4 align-items-center">
                    <FormInputs
                      type="number"
                      id="price"
                      name="price"
                      label="Price (required)"
                      register={register}
                      validateFields={validateFields?.price}
                      errors={errors.price}
                      placeholder="Enter product price"
                      className="mb-3 w-100"
                    />
                    <Controller
                      name="inStock"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex gap-3 w-100">
                          <span className="fw-bold small">
                            {field.value ? "ITEM IN STOCK" : "OUT OF STOCK"}
                          </span>
                          {field.value ? (
                            <FaToggleOn
                              size="25px"
                              onClick={() => field.onChange(false)}
                              className="cursor text-success"
                              role="button"
                            />
                          ) : (
                            <FaToggleOff
                              size="25px"
                              onClick={() => field.onChange(true)}
                              className="cursor"
                              role="button"
                            />
                          )}
                        </div>
                      )}
                    />
                  </div>
                </CardBox>
                <CardBox>
                  <Texts text="IMAGE GALLERY" size="12px" className="fw-bold" />
                  <div className="position-relative rounded-1 bg-secondary-subtle px-4 py-5">
                    <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm w-50 mx-auto">
                      <FaCloudUploadAlt size="30px" />
                      <span className="fw-medium">
                        {selectedImage?.length > 0
                          ? "Change Images"
                          : "Upload Images"}
                      </span>
                    </div>
                    <Controller
                      name="image"
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <div>
                          <Form.Control
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            isInvalid={!!errors}
                            multiple
                            onChange={(e) => {
                              handleImage(e);
                              field.onChange(e);
                            }}
                            className="position-absolute opacity-0"
                            style={{ top: "25%", right: "0", height: "60px" }}
                          />

                          <Form.Control.Feedback
                            type="invalid"
                            className="text-start"
                          >
                            {errors.image && errors.image.message}
                          </Form.Control.Feedback>
                        </div>
                      )}
                    />
                  </div>
                  <div className="d-flex mt-2">
                    {(selectedImage.length > 0
                      ? selectedImage
                      : productDetail?.image
                    )?.map((img, i) => (
                      <div
                        className="position-relative me-3"
                        key={i}
                        style={{ width: "70px", height: "70px" }}
                      >
                        <Image
                          src={img}
                          alt={
                            selectedImage.length > 0
                              ? "image preview"
                              : productDetail?.name
                          }
                          style={{ width: "60px", height: "60px" }}
                          className="mt-3 me-3"
                        />
                        {selectedImage.length > 0 && (
                          <IoCloseCircle
                            className="position-absolute top-0 end-0 cursor"
                            size="25px"
                            onClick={() =>
                              setSelectedImage(
                                selectedImage.filter((_, index) => index !== i)
                              )
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
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
                  <div className="mt-3 d-flex gap-2">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex gap-3">
                          {field.value ? (
                            <FaToggleOn
                              size="25px"
                              onClick={() => field.onChange(false)}
                              className="cursor text-success"
                              role="button"
                            />
                          ) : (
                            <FaToggleOff
                              size="25px"
                              onClick={() => field.onChange(true)}
                              className="cursor"
                              role="button"
                            />
                          )}
                          <span className="fw-bold small">
                            {field.value
                              ? "PRODUCT IS ACTIVE"
                              : "PRODUCT NOT ACTIVE"}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                  <Form.Text className="small fw-medium">
                    This enables your product to be seen by buyers
                  </Form.Text>
                </CardBox>
                <CardBox>
                  <Texts text="CATEGORY" size="12px" className="fw-bold" />
                  {error && (
                    <Alert variant="danger" className="p-2">
                      {error?.response?.data?.error}
                    </Alert>
                  )}
                  {isLoading ? (
                    <div className="d-flex justify-content-center mb-2">
                      <Spinner animation="grow" size="sm" />
                    </div>
                  ) : (
                    <Form.Group controlId={"category"}>
                      <Form.Select
                        aria-label="Default select category"
                        {...register("category", validateFields.category)}
                        isInvalid={!!errors.category}
                        defaultValue={""}
                        style={{ height: "55px" }}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {categoryDetail?.map((item) => (
                          <option value={item.name} key={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
                        {errors.category?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                </CardBox>
                <CardBox>
                  <Texts text="CONDITION" size="12px" className="fw-bold" />
                  <Form.Group controlId={"condition"}>
                    <Form.Select
                      aria-label="Default select condition"
                      {...register("condition")}
                      defaultValue={""}
                      style={{ height: "55px" }}
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
                      <option value="new">New</option>
                      <option value="featured">Featured</option>
                      <option value="best seller">Best Seller</option>
                      <option value="normal">Normal</option>
                    </Form.Select>
                    <Form.Text className="small fw-medium">
                      This selects your product based on certan kinds
                    </Form.Text>
                  </Form.Group>
                </CardBox>
                <CardBox>
                  <Texts
                    text="DELETE PRODUCT"
                    className="fw-bold"
                    size="12px"
                  />
                  <Texts
                    text="DELETE PRODUCT"
                    className="text-center fw-bold bg-danger p-2 text-white cursor"
                    size="12px"
                    onClick={() => setShowModal(true)}
                  />
                  <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                    <RiErrorWarningLine color="red" size="30px" />
                    <span className="small">
                      Deleting this product is permanent and cannot be reversed.
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
          title="Delete product"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete this product"
            className="fw-bold"
          />
          <Texts text="Deleting this product is permanent and cannot be reversed. Are you sure?" />
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
              onClick={deleteAProduct}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default Edit;
