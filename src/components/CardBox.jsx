const CardBox = ({ children, ...props }) => {
  return (
    <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3" {...props}>
      {children}
    </div>
  );
};

export default CardBox;
