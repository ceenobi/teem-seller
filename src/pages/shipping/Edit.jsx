import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  Page,
  Texts,
  ModalBox,
} from "@/components";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useStore } from "@/hooks";
import { useNavigate, useLoaderData, useNavigation } from "react-router-dom";
import { handleError, state, validateFields } from "@/utils";
import { shippingService } from "@/api";
import { useEffect, useMemo, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { Helmet } from "react-helmet-async";

const Edit = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { data } = useLoaderData();
  const shippingDetail = useMemo(() => data, [data]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const { token, merchant, setShippingData } = useStore();

  useEffect(() => {
    if (shippingDetail) {
      setValue("state", shippingDetail?.state);
      setValue("country", shippingDetail?.country);
      setValue("amount", shippingDetail?.amount);
    }
  }, [setValue, shippingDetail]);

  const deleteShippingFee = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await shippingService.deleteShipping(
        merchant.merchantCode,
        shippingDetail._id,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setShippingData((prevData) => [
          ...prevData.filter(
            (shipping) => shipping._id !== shippingDetail?._id
          ),
        ]);
        navigate("/shipping");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await shippingService.updateShipping(
        merchant.merchantCode,
        shippingDetail._id,
        formData,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setShippingData((prevData) => [
          ...prevData.filter(
            (shipping) => shipping._id !== data.updatedShipping._id
          ),
          data.updatedShipping,
        ]);
        navigate("/shipping");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit shipping fee</title>
        <meta
          name="description"
          content="Update fees for state"
        />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack /> Shipping
            </>
          }
          size="1rem"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/shipping")}
        />
        <Headings text="Edit Shipping Fee" size="1.5rem" />
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
              <Col md={7} xl={8}>
                <CardBox>
                  <Texts text="DETAILS" size="12px" className="fw-bold" />
                  <Form.Group controlId="state" className="mb-3 w-100">
                    <Form.Select
                      aria-label="select state"
                      defaultValue=""
                      isInvalid={!!errors.state}
                      style={{ height: "57px" }}
                      {...register("state", validateFields.state)}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {state?.map((item) => (
                        <option key={item.id} value={item.code} disabled>
                          {item.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="country" className="mb-3 w-100">
                    <Form.Select
                      aria-label="select country"
                      {...register("country", validateFields.country)}
                      defaultValue=""
                      isInvalid={!!errors.country}
                      style={{ height: "57px" }}
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      <option value="Nigeria" disabled>
                        Nigeria
                      </option>
                    </Form.Select>
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-start"
                    >
                      {errors?.country?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <FormInputs
                    type="number"
                    id="amount"
                    label="Amount"
                    placeholder="Enter amount"
                    className="w-100"
                    name="amount"
                    register={register}
                    validateFields={validateFields?.amount}
                    errors={errors.amount}
                  />
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
                    text="DELETE SHIPPING FEE"
                    className="fw-bold"
                    size="12px"
                  />
                  <Texts
                    text="DELETE SHIPPING FEE"
                    className="text-center fw-bold bg-danger p-2 text-white cursor"
                    size="12px"
                    onClick={() => setShowModal(true)}
                  />
                  <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                    <RiErrorWarningLine color="red" size="30px" />
                    <span className="small">
                      Deleting your shipping fee is permanent and cannot be
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
          title="Delete shipping fee"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete your shipping fee"
            className="fw-bold"
          />
          <Texts text="Deleting your shipping fee is permanent and cannot be reversed. Are you sure?" />
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
              onClick={deleteShippingFee}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default Edit;
