import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { registerUser } from "../services/emailService";

const TempPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseDetails, userDetails } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompletePayment = async () => {
    try {
      setIsProcessing(true);
      
      // First register the user
      const registrationResult = await registerUser({
        name: userDetails?.name,
        email: userDetails?.email,
        phone: userDetails?.phone
      });

      // Simulate successful payment and redirect with registration ID
      navigate('/payment-status', { 
        state: { 
          courseDetails,
          userDetails,
          registrationId: registrationResult.registration.registrationId
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to process registration. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!courseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">No course information found. Please return to the course page.</p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Return to Courses
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <Card className="p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateway</h1>
            <p className="text-gray-600">(Temporary Simulation)</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{courseDetails?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${courseDetails?.price}</span>
                </div>
                <div className="border-t border-blue-100 my-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${courseDetails?.price}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{userDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userDetails?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{userDetails?.phone}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCompletePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              This is a simulation. No real payment will be processed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TempPaymentPage;