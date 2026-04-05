const Card = ({ children, className = '', padding = true, hover = false, onClick }) => {
  const baseStyles = 'bg-white rounded-lg shadow-md';
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

// Made with Bob
