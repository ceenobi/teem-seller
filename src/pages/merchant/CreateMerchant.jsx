import { merchantImg } from "@/assets";
import { Container, Image, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/hooks";
import { merchantService } from "@/api";
import { toast } from "react-toastify";
import { handleError, validateFields } from "@/utils";
import styles from "../styles.module.css";
import { ActionButton, FormInputs, Headings, Texts } from "@/components";
import { Helmet } from "react-helmet-async";

const CreateMerchant = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setMerchant, token } = useStore();
  const navigate = useNavigate();

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await merchantService.createMerchant(
        credentials,
        token
      );
      if (status === 201) {
        toast.success(data.msg);
        setMerchant(data.merchant);
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Become a Merchant</title>
        <meta name="description" content="Register to start selling" />
      </Helmet>
      <div className={`${styles.merchantBg}`}>
        <Container fluid="xl" className="d-lg-flex justify-content-between">
          <div className="d-none d-lg-block bg-white p-5 min-vh-100">
            <Headings
              text={<>Let&apos;s set up your merchant account</>}
              size="1.875rem"
            />
            <Texts
              text="Your information can be changed or updated at any time."
              className="fw-medium my-4"
            />
            <div className="mt-4 d-flex justify-content-center">
              <Image
                src={merchantImg}
                alt="merchantImage"
                loading="lazy"
                className="w-100 object-fit-cover"
                style={{ height: "400px" }}
              />
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center mx-5 min-vh-100">
            <Form
              className={`${styles.form} mt-2 mx-auto`}
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <Texts
                text="MERCHANT DETAILS"
                size="12px"
                className="fw-bold text-white"
              />
              <FormInputs
                type="text"
                id="merchantName"
                label="Merchant Name(required)"
                placeholder="merchant name"
                className="mb-3"
                name="merchantName"
                register={register}
                validateFields={validateFields?.merchantName}
                errors={errors.merchantName}
              />
              <FormInputs
                type="email"
                id="merchantEmail"
                label="Merchant Email(required)"
                placeholder="merchant email"
                className="mb-3"
                name="merchantEmail"
                register={register}
                validateFields={validateFields?.merchantEmail}
                errors={errors.merchantEmail}
              />
              <Form.Group controlId="currency">
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
                <Form.Control.Feedback type="invalid" className="text-start">
                  {errors?.currency?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="mt-4 d-flex gap-4 align-items-center justify-content-end w-100">
                <span
                  className="fw-medium text-white cursor"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </span>
                <ActionButton
                  text="Next"
                  pending={isSubmitting}
                  disabled={isSubmitting}
                  className="w-50 btns"
                  type="submit"
                />
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CreateMerchant;
