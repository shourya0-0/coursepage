import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  className = "", 
  disabled = false, 
  variant = "primary", 
  fullWidth = false,
  ...props 
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-indigo-900 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
    secondary: "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        px-5 py-2.5 text-sm font-medium
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

