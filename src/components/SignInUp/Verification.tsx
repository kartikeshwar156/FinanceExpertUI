import React, { useState } from "react";
import "./Verificatio.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "../../store/store";
import { apiRefreshCalls } from "../../services/ApiServices/ApiRefreshCalls";

const Verification = ({ onComplete }: { onComplete: () => void }) => {
  const setUserInfo = useAuth((state) => state.setUserInfo);
  const setToken = useAuth((state) => state.setToken);

  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for signup
  const [signupUserName, setSignupUserName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Handle Signup
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      id: "",
      gmail: "kartik12345678@gmail.com",
      userName: "",
      password: "kartik12345@",
      isPremium: "",
      subscriptionPlan: "",
      paymentVerified: "",
      registeredAt: "",
      lastLoginAt: "",
      premiumExpiryDate: ""
    };
    try {
      const res = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo({
          userName: data.userName,
          gmail: data.gmail,
          isPremium: data.isPremium,
          premiumExpiryDate: data.premiumExpiryDate,
          subscriptionPlan: data.subscriptionPlan,
        });
        setToken(data.jwt); // Store JWT in memory only
        onComplete();
      } else {
        const data = await res.json();
        alert("Signup failed: " + (data.message || res.status));
      }
    } catch (err) {
      alert("Signup error: " + err);
    }
  };

  // Handle Signin
  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      id: "",
      gmail: "kartik12345678@gmail.com",
      userName: "",
      password: "kartik12345@",
      isPremium: "",
      subscriptionPlan: "",
      paymentVerified: "",
      registeredAt: "",
      lastLoginAt: "",
      premiumExpiryDate: ""
    };
    try {
      const res = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo({
          userName: data.userName,
          gmail: data.gmail,
          isPremium: data.isPremium,
          premiumExpiryDate: data.premiumExpiryDate,
          subscriptionPlan: data.subscriptionPlan,
        });
        setToken(data.jwt); // Store JWT in memory only
        onComplete();
      } else {
        const data = await res.json();
        alert("Signin failed: " + (data.message || res.status));
      }
    } catch (err) {
      alert("Signin error: " + err);
    }
  };

  return (
    <div className="container">
      <input type="checkbox" id="flip" />
      <div className="cover">
        <div className="front">
          <img src="/imgs/frontImg.jpg" alt="" />
          <div className="text">
            <span className="text-1">
              Every new friend is a <br /> new adventure
            </span>
            <span className="text-2">Let's get connected</span>
          </div>
        </div>
        <div className="back">
          <img className="backImg" src="/imgs/backImg.jpg" alt="" />
          <div className="text">
            <span className="text-1">
              Complete miles of journey <br /> with one step
            </span>
            <span className="text-2">Let's get started</span>
          </div>
        </div>
      </div>
      <div className="forms">
        <div className="form-content">
          <div className="login-form">
            <div className="title">Login</div>
            <form onSubmit={handleSignin}>
              <div className="input-boxes">
                <div className="input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="text"
                    placeholder="Enter your email"
                  //   required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                  //   required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className="text">
                  <a href="#">Forgot password?</a>
                </div>
                <div className="button input-box">
                  <input type="submit" value="Submit" />
                </div>
                <div className="text sign-up-text">
                  Don't have an account? <label htmlFor="flip">Sigup now</label>
                </div>
              </div>
            </form>
          </div>
          <div className="signup-form">
            <div className="title">Signup</div>
            <form onSubmit={handleSignup}>
              <div className="input-boxes">
                <div className="input-box">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Enter your Username"
                    required
                    value={signupUserName}
                    onChange={e => setSignupUserName(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    required
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                  />
                </div>
                <div className="button input-box">
                  <input type="submit" value="Submit" />
                </div>
                <div className="text sign-up-text">
                  Already have an account?{" "}
                  <label htmlFor="flip">Login now</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
