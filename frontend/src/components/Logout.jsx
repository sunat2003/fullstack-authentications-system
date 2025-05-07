import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate=useNavigate();
    const handleLogoutClick=()=>{
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        toast.success("User Logout Successfull");
        navigate("/");
    }
  return (
    <div>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  )
}

export default Logout;
