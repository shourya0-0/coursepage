import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, className = "", disabled = false, ...props }) => {
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
        px-4 py-2 text-sm font-medium
        rounded-lg shadow-sm
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

