import { discountService } from "@/api";
import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  Page,
  Texts,
} from "@/components";
import { useStore } from "@/hooks";
import { generateDiscountCode, handleError, validateFields } from "@/utils";
import { Badge, Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";

const Add = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { merchant, token, getDiscounts, setGetDiscounts } = useStore();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      discountCode: "",
    },
  });

  const generateCODE = () => {
    const getCode = generateDiscountCode();
    setValue("discountCode", getCode);
  };

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await discountService.createDiscount(
        merchant.merchantCode,
        formData,
        token
      );
      if (status === 201) {
        toast.success(data.msg);
        setGetDiscounts([data.discount, ...getDiscounts]);
        navigate("/discounts");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add a discount</title>
        <meta name="description" content="Create discount." />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack /> Discounts
            </>
          }
          size="1rem"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate(-1)}
        />
        <Headings text="Add discount" size="1.5rem" />
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
                      GENERATE
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
              </Col>
            </Row>
          </Form>
        )}
      </Page>
    </>
  );
};

export default Add;
