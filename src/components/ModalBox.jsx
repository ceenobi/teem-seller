import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const ModalBox = ({ show, handleClose, size, title, children, ...props }) => {
  return (
    <Modal show={show} onHide={handleClose} size={size} centered {...props}>
      <div className="d-flex justify-content-between align-items-center p-3">
        <Modal.Title style={{ fontSize: "18px" }} className="fw-bold">
          {title}
        </Modal.Title>
        <IoClose size="20px" className="cursor" onClick={handleClose} />
      </div>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalBox;
