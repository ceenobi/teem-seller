import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <BounceLoader color="#1c956e" />
    </div>
  );
};

export default Loading;
