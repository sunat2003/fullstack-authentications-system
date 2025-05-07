import React, { useEffect, useState } from "react";
import Logout from "../components/Logout";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/home", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setUserInfo({
      username: name,
      useremail: email,
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Welcome, {userInfo?.username}</h2>
        <p className="text-center text-gray-500 mb-6">Your Dashboard</p>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">User Information</h3>
          <p className="text-gray-600">Email: {userInfo?.useremail}</p>

          <h3 className="text-xl font-semibold text-gray-700">Data from API</h3>
          <p className="text-gray-600">{data?.data}</p>
        </div>

        <div className="mt-6">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
