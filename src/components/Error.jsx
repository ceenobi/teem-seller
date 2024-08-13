import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Page from "./Page";
import { Alert } from "react-bootstrap";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  const errorMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An error has occurred while trying to fetch data";

  if (isRouteErrorResponse(error)) {
    return errorMessage;
  }

  return (
    <Page>
      <Alert variant="danger"> {errorMessage}</Alert>
    </Page>
  );
};

export default Error;
