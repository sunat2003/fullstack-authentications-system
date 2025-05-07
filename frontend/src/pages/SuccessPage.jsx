// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");

    if (token && email && name) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("username",name);
      localStorage.setItem("email",email);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default SuccessPage;
