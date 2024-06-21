import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useAxiosSecure } from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

export const CheckoutForm = () => {
  const [newFundAmount, setNewFundAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  useEffect(() => {
    if (newFundAmount > 0) {
      const fetchPaymentIntent = async () => {
        try {
          const response = await axiosSecure.post("/create-payment-intent", { price: newFundAmount });
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error("Error fetching payment intent:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch payment intent. Please try again.",
          });
        }
      };
      fetchPaymentIntent();
    }
  }, [newFundAmount, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });
      if (error) {
        console.error("Payment error:", error);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: error.message || "Something went wrong. Please try again.",
        });
      } else {
        console.log("PaymentIntent:", paymentIntent);
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Thank you for your donation!",
        });
        // Handle successful payment here (e.g., update the backend, display a success message, etc.)
        const payment ={
            name : user.displayName,
            email : user.email,
            amount : newFundAmount,
            date : new Date()
        }

       const res = await axiosSecure.post('/payments',payment);
       console.log('paymentsaved',res);
      }
    } catch (error) {
      console.error("Error confirming card payment:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={newFundAmount}
          onChange={(e) => setNewFundAmount(parseFloat(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button className="btn btn-ghost p-3" type="submit" disabled={!stripe || !clientSecret}>
          Pay
        </button>
      </form>
    </div>
  );
};
