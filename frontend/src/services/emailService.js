const API_URL = import.meta.env.VITE_BACKEND_URL+'/api';

export const sendEmail = async (emailData) => {
    try {
        const response = await fetch(`${API_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};