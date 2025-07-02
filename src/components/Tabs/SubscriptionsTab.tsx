import { useState, useEffect } from "react";
import { useAuth } from "../../store/store";

export default function SubscriptionsTab({ visible }: { visible: boolean }) {
  const { userInfo } = useAuth((state) => ({ userInfo: state.userInfo }));
  const token = useAuth((state) => state.token);
  const [loading, setLoading] = useState(false);

  const plans = [
    { label: "1 month", amount: 10, subscription: "30_days" },
    { label: "3 months", amount: 20, subscription: "90_days" },
  ];

  const handlePayment = async (plan: typeof plans[0]) => {
    if (!userInfo?.gmail) {
      alert("User email not found");
      return;
    }
    setLoading(true);
    try {
      // First, get the Razorpay key from backend
      const keyResponse = await fetch("http://localhost:8080/api/get-key", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const key = await keyResponse.text();
      console.log(key);

      const response = await fetch("http://localhost:8080/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          gmail: userInfo.gmail,
          amount: plan.amount,
          subscription: plan.subscription
        }),
      });
      const order = await response.json();
      const options = {
        key: key, // Use the fetched key instead of hardcoded one
        amount: order.amount,
        currency: order.currency,
        name: "ExpertAssist",
        description: `Payment for ${plan.label} subscription`,
        order_id: order.id,
        callback_url: "http://localhost:8080/api/payment-callback",
        prefill: {
          name: userInfo.userName || "User Name",
          email: userInfo.gmail,
        },
      };
		console.log(options);
		console.log(window.Razorpay);

    const rzp1 = new window.Razorpay(options);
		console.log("---");
      rzp1.open();
    } catch (err) {
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`p-4 ${!visible ? "hidden" : ""}`}>
      <h2 className="text-xl font-bold mb-4">Choose a Subscription Plan</h2>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <button
            key={plan.subscription}
            className="border rounded p-4 flex flex-col items-start hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => handlePayment(plan)}
            disabled={loading}
          >
            <span className="font-semibold">{plan.label}</span>
            <span>₹{plan.amount} INR</span>
          </button>
        ))}
      </div>
    </div>
  );
} 