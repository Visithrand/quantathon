import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ 
  to = null, 
  className = "", 
  children = "Back",
  showIcon = true,
  variant = "default" // default, outline, ghost
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back one step in history
    }
  };

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95";
  
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button onClick={handleClick} className={classes}>
      {showIcon && <ArrowLeft size={18} />}
      {children}
    </button>
  );
};

export default BackButton;
