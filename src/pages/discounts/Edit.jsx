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
import { Form, Col, Row, Badge, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import {
  generateDiscountCode,
  handleError,
  validateFields,
  formatEditDate,
} from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/hooks";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { discountService } from "@/api";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Edit = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const { merchant, token, setGetDiscounts } = useStore();
  const { data } = useLoaderData();
  const discountDetails = useMemo(() => data, [data]);

  const generateCODE = () => {
    const getCode = generateDiscountCode();
    setValue("discountCode", getCode);
  };

  useEffect(() => {
    if (discountDetails) {
      setValue("discountCode", discountDetails?.discountCode);
      setValue("discountValue", discountDetails?.discountValue);
      setValue("quantity", discountDetails?.quantity);
      setValue("startDate", formatEditDate(discountDetails?.startDate));
      setValue("endDate", formatEditDate(discountDetails?.endDate));
      setValue("enabled", discountDetails?.enabled);
    }
  }, [discountDetails, setValue]);

  const deleteADiscount = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await discountService.deleteDiscount(
        merchant.merchantCode,
        discountDetails?._id,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetDiscounts((prevData) => {
          const filteredDiscounts = prevData.filter(
            (discount) => discount._id !== discountDetails?._id
          );
          return [
            ...filteredDiscounts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/discounts");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await discountService.updateDiscount(
        merchant.merchantCode,
        discountDetails?._id,
        formData,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetDiscounts((prevData) => {
          const updatedDiscounts = [
            ...prevData.filter(
              (discount) => discount._id !== data.updatedDiscount._id
            ),
            data.updatedDiscount,
          ];
          return [
            ...updatedDiscounts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/discounts");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Discount code {discountDetails?.discountCode}</title>
        <meta name="description" content="Edit discount" />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack />
              Discounts
            </>
          }
          size="16px"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/discounts")}
        />
        <Headings text="Edit Discount" size="1.5rem" />
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
                  <div className="position-relative">
                    <FormInputs
                      type="text"
                      id="discountCode"
                      name="discountCode"
                      label="Discount Code"
                      register={register}
                      validateFields={validateFields?.discountCode}
                      errors={errors.discountCode}
                      placeholder="Enter discount code"
                      className="mb-3 w-100"
                    />
                    <Badge
                      bg="dark"
                      text="light"
                      className="p-2 position-absolute top-50 end-0 translate-middle cursor"
                      role="button"
                      onClick={generateCODE}
                    >
                      REGENERATE
                    </Badge>
                  </div>
                  <div className="mt-3 d-xl-flex gap-2">
                    <FormInputs
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      label="Discount Value(%)"
                      register={register}
                      validateFields={validateFields?.discountValue}
                      errors={errors.discountValue}
                      placeholder="Enter discount value"
                      className="mb-0 w-100"
                    />
                    <FormInputs
                      type="number"
                      id="quantity"
                      name="quantity"
                      label="Quantity"
                      register={register}
                      placeholder="Enter quantity"
                      className="mb-0 w-100"
                    />
                  </div>
                  <div className="mt-3 d-xl-flex gap-2">
                    <FormInputs
                      type="date"
                      id="startDate"
                      name="startDate"
                      label="Start date"
                      register={register}
                      placeholder="Enter start date"
                      className="mb-0 w-100"
                    />
                    <FormInputs
                      type="date"
                      id="endDate"
                      name="endDate"
                      label="Expires"
                      register={register}
                      placeholder="Enter end date"
                      className="mb-0 w-100"
                    />
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
                  <div className="mt-3 d-flex gap-3">
                    <Controller
                      name="enabled"
                      control={control}
                      render={({ field }) => (
                        <div className="mt-3 d-flex gap-3">
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
                              ? "DISCOUNT ENABLED"
                              : "DISCOUNT DISABLED"}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                  <Form.Text className="small fw-medium">
                    This enables your discount to be active on products.
                  </Form.Text>
                </CardBox>
                <CardBox>
                  <Texts
                    text="DELETE DISCOUNT"
                    className="fw-bold"
                    size="12px"
                  />
                  <Texts
                    text="DELETE DISCOUNT"
                    className="text-center fw-bold bg-danger p-2 text-white cursor"
                    size="12px"
                    onClick={() => setShowModal(true)}
                  />
                  <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                    <RiErrorWarningLine color="red" size="30px" />
                    <span className="small">
                      Deleting this discount is permanent and cannot be
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
          title="Delete discount"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete this discount"
            className="fw-bold"
          />
          <Texts text="Deleting this discount is permanent and cannot be reversed. Are you sure?" />
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
              onClick={deleteADiscount}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default Edit;
