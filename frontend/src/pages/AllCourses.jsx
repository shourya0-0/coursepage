import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Users, ArrowRight, Mail, Code, PersonStanding } from "lucide-react";
import { sendEmail } from "../services/emailService";

const AllCoursesPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const contentData = {
    cohorts: [
      {
        id: 1,
        title: "Craft a Resume That Says 'Hire Me' Without Saying a Word",
        instructor: "IndieGuru",
        date: "15 May - 30 July 2025",
        price: 49,
        originalPrice: 98, // Changed to make it exactly 50% off
        image: "/image.png",
        color: "#f8f9ff", // Slightly improved background color
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3
      }
    }
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    
    setShowConfirm(true);
  };

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  // SEE HERE FOR CHANGES
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  // -- SEND THE MAIL AFTER THE CALLBACK IS INITIATED ---
  // SAVE THE DETAILS IN 
  const handleConfirmRegistration = () => {
    // ADD THE DETAILS IN DB
    // FETCH THE DETAILS FORM DB WHEN PAYMENT IS SUCCESSED ( CALLBACK ) IN USEEFFECT AND AFTER THAT SEND THE MAIL
    // DB INCLUDE (EMAIL NAME PHONE PAYMENT STATUS (MAKE AN ENUM))

    // DB Code
    //  - Payment_status = Pending
    
    //CHECK PAYMENT SUCCESS PAGE
  if (!email || !name || !phone) {
    alert("Please fill in all required details.");
    return;
  }

  window.location.href = 'https://rzp.io/rzp/bDNGTXB';
};

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  const CourseCard = ({ course }) => {
    const discountPercentage = 50; // Fixed at 50% discount
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01, transition: { type: "tween", ease: "easeOut", duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-blue-100"
      >
        <div className="relative h-44" style={{ backgroundColor: course.color }}>
          <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-1 px-3 rounded-full text-xs shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#003265] mb-2 group-hover:text-blue-600 transition-colors text-left">
            {course.title}
          </h3>
          
          <div className="flex items-start mb-3">
            <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-2 shadow-sm border border-blue-50 flex-shrink-0">
              {course.instructor.charAt(0)}
            </span>
            <div>
              <span className="font-medium text-sm text-gray-800 block">{course.instructor}</span>
              <span className="text-xs text-gray-500">Course Instructor</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {/* <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              <span>{course.students || "20"} students</span>
            </div> */}
            
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit">
              <span className="text-blue-500 mr-1">•</span>
              <span>{course.date}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-[#003265]">₹{course.price}</span>
              <span className="ml-2 text-gray-400 line-through text-sm">₹{course.originalPrice}</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-full px-4 py-1 flex items-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              onClick={() => handleEnrollClick(course)}
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-400 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {items.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-[1.5px] z-40"
            onClick={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "tween", ease: "easeOut" }}
        className={`w-full px-4 sm:px-6 lg:px-8 pt-[100px] ${isModalOpen ? 'blur-sm' : ''} transition-all duration-300`}
      >
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="w-full mb-4 sm:mb-0 text-center sm:text-left">
            <div className="inline-block mb-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              New cohorts starting on 15 May 2025
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "tween", ease: "easeOut", duration: 0.3 }}
              className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent"
            >
              Featured Cohorts
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "tween", ease: "easeOut", duration: 0.3 }}
              className="text-gray-600 text-base sm:text-lg max-w-2xl leading-snug"
            >
              Join our active learning cohorts for an immersive educational experience with industry experts
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <CategorySection title="Active Cohorts" items={contentData.cohorts} />
        </motion.div>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEmail("");
          setName("");
          setPhone("");
          setShowConfirm(false);
        }}
        title={showConfirm ? "Confirm Registration" : "Enter Your Details"}
        className="bg-white/20 dark:bg-black/20"
        workshopData={{
          workshopTitle: selectedCourse?.title || "Workshop Registration",
          expertName: selectedCourse?.instructor || "Expert Instructors",
          expertDetails: "Learn from industry professionals",
          date: selectedCourse?.date || "Coming Soon",
          time: "Scheduled Sessions",
          venue: "Online & Live"
        }}
      >
        {!showConfirm ? (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100">
              <p className="text-xs text-blue-800">Fill in your details to secure your spot in this cohort. Limited seats available!</p>
            </div>
            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="mt-4">
              <Button 
                variant="primary"
                fullWidth
                onClick={handleEmailSubmit}
                className="mt-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
              <h3 className="font-semibold text-indigo-800 mb-2 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registration Details
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between p-1.5 border-b border-indigo-100">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="font-medium text-indigo-900">{name}</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-indigo-100">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-medium text-indigo-900">{email}</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <span className="font-medium text-indigo-900">{phone}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-800">Click below to complete your registration and proceed to payment.</p>
            </div>
            
            <div className="mt-3">
              <Button 
                variant="success"
                fullWidth
                onClick={({ setIsSubmitted }) => handleConfirmRegistration(setIsSubmitted)}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 rounded-lg transition-all duration-300 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCoursesPage;