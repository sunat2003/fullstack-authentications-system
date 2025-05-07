import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Mail, Lock } from "lucide-react";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/oauth2/authorization/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8000/oauth2/authorization/github";
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      localStorage.setItem("authToken", res.data?.token);
      localStorage.setItem("username", res.data?.data?.username);
      localStorage.setItem("email", res.data?.data?.email);
      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>
        <p className="text-center text-gray-500 mb-6">Enter your credentials</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
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

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>

          {/* Links */}
          <div className="mt-4 text-sm text-center space-y-3">
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition cursor-pointer"
              >
                Sign up now
              </span>
            </p>

            <div className="flex justify-center gap-6 text-gray-600">
              <button
                onClick={() => navigate("/change-password")}
                className="flex items-center gap-1 hover:text-blue-700 hover:underline transition"
              >
                <Lock size={16} /> Change Password
              </button>

              <button
                onClick={() => navigate("/forgot-password")}
                className="flex items-center gap-1 hover:text-blue-700 hover:underline transition"
              >
                <Mail size={16} /> Forgot Password?
              </button>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          {/* Uncomment GitHub if needed */}
          {/* <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub Logo"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with GitHub
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
