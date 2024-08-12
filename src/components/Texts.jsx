export default function Texts({ text, color, size, className, ...props }) {
  return (
    <p
      className={className}
      style={{ color: color, fontSize: size, ...props }}
      {...props}
    >
      {text}
    </p>
  );
}
