export default function Headings({ text, color, size, extra, ...props }) {
  return (
    <h1
      className={`fw-bold ${extra}`}
      style={{ color: color, fontSize: size, ...props }}
    >
      {text}
    </h1>
  );
}
