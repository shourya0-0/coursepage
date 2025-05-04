import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Users, ArrowRight, Mail } from "lucide-react";
import { sendEmail } from "../services/emailService";

const AllCoursesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
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
        image: "/rectangle-2749.png",
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
    
    setShowConfirm(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      setLoading(true);
      await sendEmail({
        to: email,
        subject: `Welcome to ${selectedCourse.title}`,
        message: `Thank you for enrolling in ${selectedCourse.title}. We'll contact you shortly with next steps.`
      });
      setIsModalOpen(false);
      setEmail("");
      setShowConfirm(false);
      alert('Registration successful! Check your email for confirmation.');
    } catch (error) {
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
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 pt-[120px]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0a2540] mb-4">
              Featured Cohorts
            </h1>
            <p className="text-gray-600 text-lg">
              Join our active learning cohorts for an immersive educational experience
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CategorySection title="Active Cohorts" items={contentData.cohorts} />
        </motion.div>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEmail("");
          setShowConfirm(false);
        }}
        title={showConfirm ? "Confirm Registration" : "Enter Your Email"}
      >
        <div className="space-y-4">
          {!showConfirm ? (
            <>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                className="w-full bg-blue-800 hover:bg-[#0a2540] text-white py-2 rounded-lg flex items-center justify-center gap-2"
                onClick={handleEmailSubmit}
              >
                <Mail className="w-4 h-4" />
                <span>Continue</span>
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                Confirm your registration for {selectedCourse?.title} with email: {email}
              </p>
              <Button 
                className="w-full bg-blue-800 hover:bg-[#0a2540] text-white py-2 rounded-lg flex items-center justify-center gap-2"
                onClick={handleConfirmRegistration}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Registration"}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AllCoursesPage;