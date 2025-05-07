import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const email = watch("email");

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.warning("Please enter a valid email first.");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await axios.post("http://localhost:8000/api/auth/send-otp", {
        email,
      });
      toast.success(res.data.message || "OTP sent");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      setIsVerifyingOtp(true);
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-email",
        { email, otp }
      );
      setIsEmailVerified(true);
      toast.success("Email Verifield");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isEmailVerified) {
      toast.warning("Please verify your email before signing up.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        data
      );
      toast.success(res.data?.message || "Signup successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm placeholder-gray-400 ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email with Send OTP - Modern Layout */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative w-full">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp}
              className={`min-w-[140px] px-5 py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-md border transition duration-200 ease-in-out
    ${
      isSendingOtp
        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
        : "bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    }
  `}
            >
              {isSendingOtp && (
                <svg
                  className="animate-spin h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
              )}
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs -mt-4">{errors.email.message}</p>
          )}

          {/* OTP */}
          {otpSent && !isEmailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={isVerifyingOtp}
                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm placeholder-gray-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
