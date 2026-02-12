import React, { useState } from 'react';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const PaymentButton = () => {
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        setLoading(true);

        try {
            // Create Order
            await setAuthToken();
            const result = await api.post('/payments/create-order', { amount: 500 }); // 500 INR

            if (!result) {
                alert('Server error. Are you online?');
                return;
            }

            // The backend returns a String representation of the Order object, we need to parse it if it's JSON
            // But if it's just a string, we might need to be careful. 
            // Let's assume the controller returns a JSON string or object.
            // Actually PaymentController returns ResponseEntity<String> order.toString().
            // Razorpay Order.toString() returns JSON.
            const order = JSON.parse(result.data);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount.toString(),
                currency: order.currency,
                name: "CloudShare App", // Fixed typo "CouldShare"
                description: "Upgrade Transaction",
                order_id: order.id,
                handler: async function (response) {
                    const data = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    await setAuthToken();
                    const verifyResult = await api.post('/payments/verify', data);

                    if (verifyResult.data) {
                        alert("Payment Successful!");
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: currentUser?.email?.split('@')[0],
                    email: currentUser?.email,
                    contact: "9999999999"
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed or cancelled.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={displayRazorpay}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
            {loading ? 'Processing...' : 'Upgrade Now (₹500)'}
        </button>
    );
};

export default PaymentButton;
