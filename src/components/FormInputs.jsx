import { Form, FloatingLabel } from "react-bootstrap";

const FormInputs = ({
  type,
  id,
  name,
  label,
  placeholder,
  className,
  register,
  validateFields,
  errors,
  ...props
}) => {
  return (
    <FloatingLabel controlId={id} label={label} className={className}>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        size="lg"
        className="bg-light.bg-gradient"
        {...register(name, validateFields)}
        isInvalid={!!errors}
        disabled={errors && errors[name] ? true : false}
        {...props}
      />
      <Form.Control.Feedback type="invalid" className="text-start">
        {errors?.message}
      </Form.Control.Feedback>
    </FloatingLabel>
  );
};

export default FormInputs;
