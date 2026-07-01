const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="ui-loader-page">
      <div className="ui-spinner" />
      <p>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
