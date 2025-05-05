"use client"

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`
              relative w-full max-w-md pointer-events-auto
              bg-white/10 backdrop-blur-xl
              border border-white/20
              shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
              rounded-2xl
              p-6
              ${className}
            `}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Glass effect overlay */}
            <motion.div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-white/20 to-transparent opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.1 }}
            />
            
            {/* Content container */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors
                    hover:bg-black/10 active:bg-black/20
                    text-gray-700 dark:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal content with improved spacing */}
              <div className="space-y-4">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

