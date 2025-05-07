"use client"

import React, { useEffect, useState } from 'react';
/* eslint-disable */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable */
import { X, Calendar, MapPin, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, className = "", workshopData = {} }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  
  // Expose setIsSubmitted to children via React cloneElement
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setIsSubmitted });
    }
    return child;
  });

  // Reset form state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTimeout(() => {
        setShowForm(true);
        setIsSubmitted(false);
      }, 300); // Match the animation exit time
    }
  }, [isOpen]);

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

  const {
    workshopTitle = title || "Workshop Title",
    expertName = "Expert Name",
    expertDetails = "Expert details and qualifications",
    date = "May 10, 2025",
    time = "10:00 AM - 12:00 PM",
    venue = "Online"
  } = workshopData;

  // Handle back button click
  const handleBack = () => {
    if (!showForm) {
      setShowForm(true);
    } else if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      onClose(); // If we're already at the first step, close the modal
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 bg-black/40"
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
              relative w-full max-w-5xl pointer-events-auto
              bg-white
              shadow-2xl
              rounded-2xl
              overflow-hidden
              ${className}
            `}
          >
            {/* Header with close button */}
            <div className="absolute right-4 top-4 z-20">
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors
                  hover:bg-gray-100 active:bg-gray-200
                  text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Back button - always visible */}
            <div className="absolute left-4 top-4 z-20">
              <button
                onClick={handleBack}
                className="p-2 rounded-full transition-colors
                  hover:bg-gray-100 active:bg-gray-200
                  text-gray-500 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Back</span>
              </button>
            </div>
            
            {/* Two column layout */}
            <div className="flex flex-col md:flex-row min-h-[550px]">
              {/* Left column - Registration form */}
              <div className="w-full md:w-1/2 p-10 bg-white border-r border-gray-100">
                {/* Centered logo above heading */}
                <div className="flex justify-center mb-6">
                  <img src="/logo.png" alt="Logo" className="h-24" />
                </div>
                
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">
                      Reserve Your Spot
                    </h2>
                    
                    {/* Form content - Left aligned labels */}
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
                      {/* Apply left alignment to form children */}
                      <div className="text-left">
                        {childrenWithProps}
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-indigo-700">
                      <p>Complete the form to secure your participation</p>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="rounded-full bg-green-50 p-3 w-24 h-24 flex items-center justify-center">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
                    <p className="text-gray-700 max-w-xs">
                      Thank you for registering for this workshop. You'll receive a confirmation email with all the details.
                    </p>
                    <div className="flex space-x-4">
                      <button 
                        onClick={handleBack}
                        className="mt-4 px-8 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Back to Form
                      </button>
                      <button 
                        onClick={onClose}
                        className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Workshop details */}
              <div className="w-full md:w-1/2 p-10 bg-white">
                <div className="space-y-6">
                  {/* A) Workshop heading */}
                  <h2 className="text-2xl font-bold text-indigo-900 mt-4">
                    {workshopTitle}
                  </h2>
                  
                  {/* B) Expert details */}
                  <div className="flex items-start space-x-4">
                    <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-semibold">
                      {expertName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{expertName}</h3>
                      <p className="text-sm text-gray-600">{expertDetails}</p>
                    </div>
                  </div>
                  
                  {/* C) What you'll learn */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-indigo-900 mb-3 text-left">What you'll learn</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Learning point 1</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Learning point 2</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Learning point 3</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Learning point 4</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* D) Date, time and venue */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="font-semibold text-indigo-900 mb-2 text-left">Workshop Details</h3>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{venue}</span>
                    </div>
                  </div>
                  
                  {/* Google Meet statement */}
                  <div className="p-4 bg-white border border-indigo-100 rounded-xl text-sm text-indigo-700">
                    <p className="font-medium">Virtual Workshop</p>
                    <p>This workshop will be conducted via Google Meet. Login details will be shared after registration.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

