import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  ModalBox,
  Page,
  Texts,
} from "@/components";
import { Form, Image, Col, Row } from "react-bootstrap";
import { merchantService } from "@/api";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "@/hooks";
import { FaImage } from "react-icons/fa";
import { useState, useEffect } from "react";
import { handleError, state, validateFields } from "@/utils";
import { RiErrorWarningLine } from "react-icons/ri";
import SimpleMDE from "react-simplemde-editor";
import { IoCloseCircle } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

const Merchant = () => {
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    setValue,
  } = useForm();
  const { merchant, token, setMerchant } = useStore();

  useEffect(() => {
    if (merchant) {
      setValue("merchantName", merchant.merchantName);
      setValue("merchantEmail", merchant.merchantEmail);
      setValue("currency", merchant.currency);
      setValue("description", merchant.description);
      setValue("city", merchant?.address?.city);
      setValue("phone", merchant?.address?.phone);
      setValue("street", merchant?.address?.street);
      setValue("zip", merchant?.address?.zip);
      setValue("state", merchant?.address?.state);
      setValue("country", merchant?.address?.country);
    }
  }, [merchant, setValue]);

  const merchantNameValue = watch("merchantName");
  const merchantEmailValue = watch("merchantEmail");

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedLogoImage(reader.result);
      };
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedCoverImage(reader.result);
      };
    }
  };

  const deleteMerchantAccount = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await merchantService.deleteMerchant(token);
      if (status === 200) {
        toast.success(data.msg);
        setMerchant(null);
        setShowModal(false);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onFormSubmit = async (credentials) => {
    try {
      const formData = {
        logo: selectedLogoImage,
        coverImage: selectedCoverImage,
        merchantName: credentials.merchantName,
        merchantEmail: credentials.merchantEmail,
        description: credentials.description,
        currency: credentials.currency,
        street: credentials.street,
        city: credentials.city,
        phone: credentials.phone,
        zip: credentials.zip,
        state: credentials.state,
        country: credentials.country,
      };
      const { status, data } = await merchantService.updateMerchant(
        merchant?._id,
        formData,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setMerchant(data.updatedMerchant);
        setSelectedLogoImage(null);
        setSelectedCoverImage(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Merchant {merchant.merchantName}</title>
        <meta name="description" content="Your merchant page" />
      </Helmet>
      <Page>
        <Headings text="Merchant details" size="1.5rem" />
        <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)} l>
          <Row>
            <Col md={7} xl={8}>
              <CardBox>
                <Texts text="DETAILS" size="12px" className="fw-bold" />
                <div className="d-xl-flex gap-2">
                  <FormInputs
                    type="text"
                    id="merchantName"
                    label="Merchant Name"
                    placeholder="Merchant Name"
                    className="mb-3 w-100"
                    name="merchantName"
                    register={register}
                    validateFields={
                      merchantNameValue && validateFields?.merchantName
                    }
                    errors={errors.merchantName}
                  />
                  <FormInputs
                    type="email"
                    id="merchantEmail"
                    label="Merchant Email"
                    placeholder="Merchant Email"
                    className="mb-3 w-100"
                    name="merchantEmail"
                    register={register}
                    validateFields={
                      merchantEmailValue && validateFields?.merchantEmail
                    }
                    errors={errors.merchantEmail}
                  />
                </div>
              </CardBox>
              <CardBox>
                <Texts text="DESCRIPTION" size="12px" className="fw-bold" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <SimpleMDE placeholder="Description" {...field} />
                  )}
                />
                <Form.Text id="description" muted className="fw-bold">
                  A brief description about your store.
                </Form.Text>
              </CardBox>
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
                  />
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
                  />
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
                  <FormInputs
                    type="tel"
                    id="phone"
                    label="Phone number"
                    placeholder="Enter phone"
                    className="mb-3 w-100"
                    name="phone"
                    register={register}
                  />
                  <Form.Group controlId="currency" className="w-100">
                    <Form.Select
                      aria-label="currency select"
                      {...register("currency", validateFields.currency)}
                      defaultValue=""
                      isInvalid={!!errors.currency}
                      style={{ height: "57px" }}
                    >
                      <option value="" disabled>
                        Select Currency
                      </option>
                      <option value="NGN">NGN - Nigerian naira</option>
                    </Form.Select>
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-start"
                    >
                      {errors?.currency?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
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
              </CardBox>
              <CardBox>
                <Headings
                  text={`Merchant Id: ${merchant?.merchantCode}`}
                  size="1.2rem"
                  extra="bg-secondary-subtle p-3 rounded-1"
                />
                <Texts
                  text="This is your unique merchant ID. We may ask for it when you contact us."
                  size="14px"
                  className="fw-medium"
                />
              </CardBox>
              <CardBox>
                <Texts text="LOGO" size="12px" className="fw-bold" />
                <div className="rounded-1 bg-secondary-subtle p-4 position-relative">
                  <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm">
                    <FaImage />
                    <span>
                      {merchant?.logo ? "Change logo" : "Upload logo"}
                    </span>
                  </div>
                  <Form.Control
                    type="file"
                    id="logo"
                    name="logo"
                    {...register("logo")}
                    accept="image/*"
                    className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                    onChange={handleLogo}
                  />
                </div>
                {selectedLogoImage && (
                  <div
                    className="mt-2 position-relative"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <Image
                      src={selectedLogoImage}
                      alt="logo preview"
                      style={{ width: "60px", height: "60px" }}
                      className="mt-3 me-2"
                    />
                    <IoCloseCircle
                      className="position-absolute top-25 cursor"
                      size="25px"
                      onClick={() => setSelectedLogoImage(null)}
                    />
                  </div>
                )}
              </CardBox>
              <CardBox>
                <Texts text="COVER IMAGE" size="12px" className="fw-bold" />
                <div className="rounded-1 bg-secondary-subtle p-4 position-relative">
                  <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm">
                    <FaImage />
                    <span>
                      {merchant?.coverImage ? "Change Image" : "Upload Image"}
                    </span>
                  </div>
                  <Form.Control
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    {...register("coverImage")}
                    accept="image/*"
                    className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                    onChange={handleCoverImage}
                  />
                </div>
                {selectedCoverImage && (
                  <div
                    className="mt-2 position-relative"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <Image
                      src={selectedCoverImage}
                      alt="cover image preview"
                      style={{ width: "60px", height: "60px" }}
                      className="mt-3 me-2"
                    />
                    <IoCloseCircle
                      className="position-absolute top-25 cursor"
                      size="25px"
                      onClick={() => setSelectedCoverImage(null)}
                    />
                  </div>
                )}
              </CardBox>
              <CardBox>
                <Texts
                  text="DELETE MERCHANT ACCOUNT"
                  className="fw-bold"
                  size="12px"
                />
                <Texts
                  text="DELETE MERCHANT ACCOUNT"
                  className="text-center fw-bold bg-danger p-2 text-white cursor"
                  size="12px"
                  onClick={() => setShowModal(true)}
                />
                <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                  <RiErrorWarningLine color="red" size="30px" />
                  <span className="small">
                    Deleting your merchant account is permanent and cannot be
                    reversed.
                  </span>
                </div>
              </CardBox>
            </Col>
          </Row>
        </Form>
      </Page>
      <ModalBox
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Delete merchant account"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete your merchant account"
          className="fw-bold"
        />
        <Texts text="Deleting your merchant account is permanent and cannot be reversed. Are you sure?" />
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
            onClick={deleteMerchantAccount}
            size="sm"
          />
        </div>
      </ModalBox>
    </>
  );
};

export default Merchant;
