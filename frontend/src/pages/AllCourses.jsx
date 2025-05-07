import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Users, ArrowRight, Mail } from "lucide-react";
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
        title: "Data Science Spring 2025 Cohort",
        instructor: "Team of 5 Industry Experts",
        date: "15 May - 30 July 2025",
        students: 32,
        price: 1200,
        originalPrice: 1500,
        image: "/image.png",
        color: "#ffc619",
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
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

  const handleConfirmRegistration = async (setIsSubmitted) => {
    try {
      setLoading(true);
      await sendEmail({
        to: email,
        subject: `Welcome to ${selectedCourse.title}`,
        message: `Thank you for enrolling in ${selectedCourse.title}. We'll contact you shortly with next steps.`,
        name,
        phone
      });
      
      // Close modal and reset form
      setIsModalOpen(false);
      
      // Store user details for the payment page
      const userDetails = {
        name,
        email,
        phone
      };
      
      // Reset form fields
      setEmail("");
      setName("");
      setPhone("");
      setShowConfirm(false);
      
      // Use setIsSubmitted function if provided (for backward compatibility)
      if (setIsSubmitted) {
        setIsSubmitted(true);
      }
      
      // Redirect to payment page with course and user details
      navigate('/payment', { 
        state: { 
          courseDetails: selectedCourse,
          userDetails: userDetails
        }
      });
      
    } catch {
      alert('Failed to send confirmation email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CourseCard = ({ course }) => {
    const discountPercentage = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: course.color }}>
          <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              {course.instructor.charAt(0)}
            </span>
            {course.instructor}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{course.students} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">${course.price}</span>
              <span className="ml-2 text-gray-400 line-through text-sm">${course.originalPrice}</span>
            </div>
            <Button 
              className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105"
              onClick={() => handleEnrollClick(course)}
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-40"
            onClick={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full px-4 sm:px-6 lg:px-8 pt-[120px] ${isModalOpen ? 'blur-sm' : ''} transition-all duration-300`}
      >
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-16">
          <div className="w-full mb-6 sm:mb-0 text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent"
            >
              Featured Cohorts
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg sm:text-xl max-w-2xl leading-relaxed"
            >
              Join our active learning cohorts for an immersive educational experience
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
          <div className="space-y-4">
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
            <div className="mt-6">
              <Button 
                variant="primary"
                fullWidth
                onClick={handleEmailSubmit}
                className="mt-2"
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-3">Registration Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{phone}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="success"
                fullWidth
                onClick={({ setIsSubmitted }) => handleConfirmRegistration(setIsSubmitted)}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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