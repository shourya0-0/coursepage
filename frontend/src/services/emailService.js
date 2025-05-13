const API_URL = import.meta.env.VITE_BACKEND_URL+'/api';

export const registerUser = async ({ email, name, phone }) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        phone,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to register');
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const confirmPaymentSuccess = async (registrationId) => {
  try {
    const response = await fetch(`${API_URL}/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// export const sendEmail = async ({ to, subject, message, name, phone }) => {
//   try {
//     const response = await fetch(`${API_URL}/send-email`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         to,
//         subject,
//         name,
//         message,
//         phone,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to send email');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };