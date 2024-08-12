import { Button, Spinner } from "react-bootstrap";

export default function ActionButton({
  text,
  className,
  type,
  pending,
  size,
  variant,
  ...props
}) {
  return (
    <Button
      type={type}
      className={`fw-medium border-0 ${className}`}
      size={size}
      variant={variant}
      {...props}
    >
      {pending ? (
        <Spinner animation="border" role="status" size="sm" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        text
      )}
    </Button>
  );
}
