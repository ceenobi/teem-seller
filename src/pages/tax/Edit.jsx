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
import { useForm, Controller } from "react-hook-form";
import { useStore } from "@/hooks";
import { useNavigate, useLoaderData, useNavigation } from "react-router-dom";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { handleError, state, validateFields } from "@/utils";
import { taxService } from "@/api";
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
  const taxDetail = useMemo(() => data, [data]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm();
  const { token, merchant, setTaxData } = useStore();

  useEffect(() => {
    if (taxDetail) {
      setValue("street", taxDetail?.address?.street);
      setValue("city", taxDetail?.address?.city);
      setValue("state", taxDetail?.address?.state);
      setValue("zip", taxDetail?.address?.zip);
      setValue("phone", taxDetail?.address?.phone);
      setValue("country", taxDetail?.address?.country);
      setValue("standardRate", taxDetail?.standardRate);
      setValue("enabled", taxDetail?.enabled);
    }
  }, [setValue, taxDetail]);

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await taxService.updateTax(
        merchant?.merchantCode,
        taxDetail?._id,
        formData,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setTaxData((prevData) => [
          ...prevData.filter((tax) => tax._id !== data.updatedTax._id),
          data.updatedTax,
        ]);
        navigate("/tax");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteATax = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await taxService.deleteTax(
        merchant?.merchantCode,
        taxDetail?._id,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setTaxData((prevData) => [
          ...prevData.filter((tax) => tax._id !== taxDetail?._id),
        ]);
        navigate("/tax");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit tax</title>
        <meta name="description" content="Edit and update tax for a state." />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack /> Tax
            </>
          }
          size="1rem"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/tax")}
        />
        <Headings text="Edit Tax" size="1.5rem" />
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Form className="mt-4 w-100" onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
              <Col md={7} xl={8}>
                <CardBox>
                  <Texts text="ADDRESS" size="12px" className="fw-bold" />
                  <FormInputs
                    type="text"
                    id="street"
                    label="Street"
                    placeholder="Enter street"
                    className="mb-3 w-100"
                    name="street"
                    register={register}
                    validateFields={validateFields?.street}
                    errors={errors.street}
                    disabled
                  />
                  <div className="d-xl-flex gap-2">
                    <FormInputs
                      type="text"
                      id="city"
                      label="City"
                      placeholder="Enter city"
                      className="mb-3 w-100"
                      name="city"
                      register={register}
                      validateFields={validateFields?.city}
                      errors={errors.city}
                      disabled
                    />
                    <Form.Group controlId="state" className="mb-3 w-100">
                      <Form.Select
                        aria-label="select state"
                        defaultValue=""
                        isInvalid={!!errors.state}
                        style={{ height: "57px" }}
                        {...register("state", validateFields.state)}
                        disabled
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {state?.map((item) => (
                          <option key={item.id} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="d-xl-flex gap-2">
                    <FormInputs
                      type="text"
                      id="zip"
                      label="Zip/Postal code"
                      placeholder="Enter zip"
                      className="mb-3 w-100"
                      name="zip"
                      register={register}
                      disabled
                    />
                    <Form.Group controlId="country" className="mb-3 w-100">
                      <Form.Select
                        aria-label="select country"
                        {...register("country", validateFields.country)}
                        defaultValue=""
                        isInvalid={!!errors.country}
                        style={{ height: "57px" }}
                        disabled
                      >
                        <option value="" disabled>
                          Select Country
                        </option>
                        <option value="Nigeria">Nigeria</option>
                      </Form.Select>
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
                        {errors?.country?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="d-xl-flex gap-2">
                    <Form.Group className="mb-3 w-100">
                      <FormInputs
                        type="number"
                        id="standardRate"
                        label="Standard Rate"
                        placeholder="Enter tax rate"
                        className="w-100"
                        name="standardRate"
                        register={register}
                        validateFields={validateFields?.standardRate}
                        errors={errors.standardRate}
                      />
                      <Form.Text id="standardRate" muted className="">
                        Set a tax rate for your products. This is calculated in
                        percentage
                      </Form.Text>
                    </Form.Group>
                    <FormInputs
                      type="tel"
                      id="phone"
                      label="Phone number"
                      placeholder="Enter phone"
                      className="mb-3 w-100"
                      name="phone"
                      register={register}
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
                              className="cursor text-success"
                              onClick={() => field.onChange(false)}
                              role="button"
                            />
                          ) : (
                            <FaToggleOff
                              size="25px"
                              className="cursor"
                              onClick={() => field.onChange(true)}
                              role="button"
                            />
                          )}
                          <span className="fw-bold small">
                            {field.value ? "TAX ENABLED" : "TAX DISABLED"}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                </CardBox>
                <CardBox>
                  <Texts text="DELETE TAX" className="fw-bold" size="12px" />
                  <Texts
                    text="DELETE TAX"
                    className="text-center fw-bold bg-danger p-2 text-white cursor"
                    size="12px"
                    onClick={() => setShowModal(true)}
                  />
                  <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                    <RiErrorWarningLine color="red" size="30px" />
                    <span className="small">
                      Deleting your tax is permanent and cannot be reversed.
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
          title="Delete tax"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete your tax"
            className="fw-bold"
          />
          <Texts text="Deleting your tax is permanent and cannot be reversed. Are you sure?" />
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
              onClick={deleteATax}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default Edit;
