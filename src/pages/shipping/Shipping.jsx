import { shippingService } from "@/api";
import {
  FormInputs,
  Headings,
  ActionButton,
  Texts,
  Page,
  CardBox,
} from "@/components";
import {
  useNavigate,
  Outlet,
  useLocation,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleError, state, validateFields } from "@/utils";
import { useStore } from "@/hooks";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

const Shipping = () => {
  const data = useLoaderData();
  const shippingList = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { shippingData, setShippingData, merchant, token } = useStore();

  useEffect(() => {
    setShippingData(shippingList.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormSubmit = async (formData) => {
    try {
      const { status, data } = await shippingService.createShipping(
        merchant.merchantCode,
        formData,
        token
      );
      if (status === 201) {
        toast.success(data.msg);
        setShippingData([...shippingData, data.shippingFee]);
        reset();
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Shipping fee for states</title>
        <meta
          name="description"
          content="Set shipping rates for different zones"
        />
      </Helmet>
      {location.pathname === "/shipping" ? (
        <Page>
          <Headings text="Shipping" size="1.5rem" />
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
                    <Texts
                      text="SET SHIPPING FEE"
                      size="12px"
                      className="fw-bold"
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
                  <CardBox>
                    <Texts
                      text="SHIPPING SUMMARY"
                      size="12px"
                      className="fw-bold"
                    />
                    {shippingData?.length > 0 ? (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>COUNTRY</th>
                            <th>STATE</th>
                            <th>AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shippingData.map(
                            ({ _id, state, country, amount }) => (
                              <tr
                                key={_id}
                                onClick={() => navigate(`/shipping/${_id}`)}
                                className="cursor"
                              >
                                <td>{country}</td>
                                <td>{state}</td>
                                <td>{amount}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    ) : (
                      <Texts
                        text="No shipping fee added yet."
                        size="14px"
                        className="fw-bold"
                      />
                    )}
                  </CardBox>
                </Col>
                <Col md={5} xl={4}>
                  <CardBox>
                    <ActionButton
                      text="Save changes"
                      className="mt-3 w-100 btns"
                      kw
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
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Shipping;
