import { toast } from "react-toastify";

const customId = "custom-id-toast"; //prevent duplicate toast action

const handleError = (error) => {
  console.error(error);
  if (error?.message === "Network Error") {
    return toast.error("Server is down", {
      toastId: customId,
    });
  }

  if (error?.response) {
    return toast.error(
      error.response.data.message ||
        error.response.data?.error ||
        error.response.data?.errors[0]?.msg ||
        "An error has occurred",
      {
        toastId: customId,
      }
    );
  }
};

export default handleError;
