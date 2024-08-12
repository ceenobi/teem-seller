const Page = ({ children, ...props }) => {
  return (
    <div className="py-5 px-4" {...props}>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Page;
