import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOtpForm = () => {

  const navigate=useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // Only digits allowed

    e.target.value = value.slice(-1); // Only allow 1 digit per input

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const verifyOtp=async(payload)=>{
    try{
       const res=await axios.post("http://localhost:8000/api/auth/verify-otp",payload)
       toast.success(res.data?.message);
       navigate("/reset-password");
    }catch(error){
      toast.error(error.response?.data?.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpvalue = inputRefs.current.map((ref) => ref.value).join("");

    if (otpvalue.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    console.log(otpvalue);

    const email=localStorage.getItem("email");
    const payload={"email":email,otp:otpvalue}
    console.log(payload);


    verifyOtp(payload);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Verify OTP
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
