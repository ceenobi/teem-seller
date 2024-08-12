import {
  ActionButton,
  CardBox,
  FormInputs,
  Headings,
  Page,
  Texts,
} from "@/components";
import { Form, Col, Row, Alert, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "@/hooks";
import {
  useNavigate,
  Outlet,
  useLocation,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { handleError, state, validateFields } from "@/utils";
import { taxService } from "@/api";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

const Tax = () => {
  const data = useLoaderData();
  const taxList = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm();
  const { merchant, token, taxData, setTaxData } = useStore();

  useEffect(() => {
    setTaxData(taxList.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxList.tax]);

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await taxService.createTax(
        merchant.merchantCode,
        credentials,
        token
      );
      if (status === 201) {
        toast.success(data.msg);
        setTaxData([...taxData, data.tax]);
        reset();
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add a new tax</title>
        <meta
          name="description"
          content="Add and see your taxes"
        />
      </Helmet>
      {location.pathname === "/tax" ? (
        <Page>
          <Headings text="Tax" size="1.5rem" />
          {navigation.state === "loading" ? (
            <div className="text-center my-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <Form
              className="mt-4 mx-auto"
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <Row>
                <Col md={7} xl={8}>
                  <CardBox>
                    <Texts text="ADDRESS" size="12px" className="fw-bold" />
                    <Alert variant="info">
                      This is used to calculate tax and is displayed on
                      invoices.
                    </Alert>
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
                          Set a tax rate for your products. This is calculated
                          in percentage
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
                  <CardBox>
                    <Texts text="TAX RATES" size="12px" className="fw-bold" />

                    <>
                      {taxData?.length > 0 ? (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>COUNTRY</th>
                              <th>STATE</th>
                              <th>STANDARD RATE</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxData.map(
                              ({ _id, address, standardRate, enabled }) => (
                                <tr
                                  key={_id}
                                  onClick={() => navigate(`/tax/${_id}`)}
                                  className="cursor"
                                >
                                  <td>{address?.country}</td>
                                  <td>{address?.state}</td>
                                  <td>{standardRate}</td>
                                  <td
                                    className={`fw-bold ${enabled ? "text-success" : "text-danger"}`}
                                  >
                                    {enabled ? "ACTIVE" : "INACTIVE"}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      ) : (
                        <Texts
                          text="You have not created a tax yet"
                          size="14px"
                          className="fw-bold"
                        />
                      )}
                    </>
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
                </Col>
              </Row>
            </Form>
          )}
        </Page>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Tax;
