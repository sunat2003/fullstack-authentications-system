import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Validation schema
const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ForgotPasswordForm = () => {



  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });



  const sendEmailOtp=async(payload)=>{
    try{
       const res=await axios.post("http://localhost:8000/api/auth/forgot-password",payload)
       localStorage.setItem("email",payload.email);
       toast.success(res.data?.message);
       navigate("/verify-otp");
    }catch(errors){
      console.error(errors.response?.data?.message);
    }
  }

  const onSubmit = async (data) => {
    sendEmailOtp(data);
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
