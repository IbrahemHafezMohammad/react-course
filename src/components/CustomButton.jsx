const CustomButton = ({ title, containerStyles, onClick }) => {
    return (
      <button className={containerStyles} onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default CustomButton;
  