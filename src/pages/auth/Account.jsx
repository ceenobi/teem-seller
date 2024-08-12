import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { Form, Row, Col, Image } from "react-bootstrap";
import { handleError, validateFields } from "@/utils";
import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  ModalBox,
  Page,
  Texts,
} from "@/components";
import { FaRegEye } from "react-icons/fa6";
import { FaCloudUploadAlt, FaRegEyeSlash } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { useStore } from "@/hooks";
import { IoCloseCircle } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

const Account = () => {
  const [reveal, setReveal] = useState(false);
  const [revealB, setRevealB] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { loggedInUser, token, setLoggedInUser, logout } = useStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  //populate input fields
  useEffect(() => {
    if (loggedInUser) {
      setValue("username", loggedInUser.username);
      setValue("email", loggedInUser.email);
      setValue("photo", loggedInUser.photo);
    }
  }, [loggedInUser, setValue]);

  const passwordValue = watch("password");
  const currentPasswordValue = watch("currentPassword");

  const handleHide = () => {
    setReveal((prev) => !prev);
  };
  const handleHideB = () => {
    setRevealB((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    transformImage(file);
  };

  const transformImage = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
    }
  };

  const deleteUserAccount = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await userService.deleteAccount(token);
      if (status === 200) {
        toast.success(data.msg);
        logout();
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
        photo: selectedImage,
        username: credentials.username,
        email: credentials.email,
        currentPassword: credentials.currentPassword,
        password: credentials.password,
      };
      const { data, status } = await userService.updateAccount(formData, token);
      if (status === 200) {
        toast.success(data.msg);
        setLoggedInUser(data.updatedUser);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Your account {loggedInUser.username}</title>
        <meta name="description" content="Edit Merchant" />
      </Helmet>
      <Page>
        <Headings text="Account" size="1.5rem" />
        <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
          <Row>
            <Col md={6} lg={7} xl={8}>
              <CardBox>
                <Texts text="DETAILS" size="12px" className="fw-bold" />
                <div className="d-xl-flex gap-2">
                  <FormInputs
                    type="text"
                    id="username"
                    label="Username"
                    placeholder="username"
                    className="mb-3 w-100"
                    name="username"
                    register={register}
                    validateFields={validateFields?.username}
                    errors={errors.username}
                  />
                  <FormInputs
                    type="email"
                    id="email"
                    label="Email"
                    placeholder="email"
                    className="mb-3 w-100"
                    name="email"
                    register={register}
                    validateFields={validateFields?.email}
                    errors={errors.email}
                  />
                </div>
              </CardBox>
              <CardBox>
                <Texts text="UPDATE PASSWORD" size="12px" className="fw-bold" />
                <div className="position-relative">
                  <FormInputs
                    type={reveal ? "text" : "password"}
                    id="currentPassword"
                    label="Current password"
                    placeholder="password"
                    className="mb-3"
                    name="currentPassword"
                    register={register}
                    validateFields={
                      currentPasswordValue && validateFields?.currentPassword
                    }
                    errors={errors.currentPassword}
                  />
                  <Texts
                    className="position-absolute top-50 end-0 translate-middle cursor"
                    text={reveal ? <FaRegEyeSlash /> : <FaRegEye />}
                    onClick={handleHide}
                  />
                </div>
                <div className="position-relative">
                  <FormInputs
                    type={revealB ? "text" : "password"}
                    id="password"
                    label="New password"
                    placeholder="password"
                    className="mb-3"
                    name="password"
                    register={register}
                    validateFields={passwordValue && validateFields?.password}
                    errors={errors.password}
                  />
                  <Texts
                    className="position-absolute top-50 end-0 translate-middle cursor"
                    text={revealB ? <FaRegEyeSlash /> : <FaRegEye />}
                    onClick={handleHideB}
                  />
                </div>
              </CardBox>
              <CardBox>
                <Texts
                  text="CHANGE PROFILE PHOTO"
                  size="12px"
                  className="fw-bold"
                />
                <div className="position-relative rounded-1 bg-secondary-subtle px-4 py-5">
                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm w-50 mx-auto">
                    <FaCloudUploadAlt size="30px" />
                    <span className="fw-medium">
                      {selectedImage ? "Change Image" : "Choose Image"}
                    </span>
                  </div>
                  <Form.Control
                    type="file"
                    id="photo"
                    name="photo"
                    label="Photo"
                    accept="image/*"
                    {...register("photo")}
                    onChange={handleImageChange}
                    className="w-100 h-100 position-absolute bottom-0 end-0 opacity-0"
                  />
                </div>
                {selectedImage && (
                  <div
                    className="mt-2 position-relative"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <Image
                      src={selectedImage}
                      alt="img preview"
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
              <CardBox>
                <Texts text="DELETE ACCOUNT" className="fw-bold" size="12px" />
                <Texts
                  text="DELETE ACCOUNT"
                  className="text-center fw-bold bg-danger p-2 text-white cursor"
                  size="12px"
                  onClick={() => setShowModal(true)}
                />
                <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                  <RiErrorWarningLine color="red" size="30px" />
                  <span className="small">
                    Deleting your account is permanent and cannot be reversed.
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
        title="Delete account"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete your account"
          className="fw-bold"
        />
        <Texts text="Deleting your account is permanent and cannot be reversed. Are you sure?" />
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
            onClick={deleteUserAccount}
            size="sm"
          />
        </div>
      </ModalBox>
    </>
  );
};

export default Account;
