import React, { useEffect, useContext } from "react";
import "./App.css";
import ErrorBoundary from "./components/Auth/ErrorBoundary.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Context } from "./main";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Navbar from "./components/Layout/Navbar.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import JobDetails from "./components/Job/JobDetails.jsx";
import Jobs from "./components/Job/Jobs.jsx";
import MyJobs from "./components/Job/MyJobs.jsx";
import PostJob from "./components/Job/PostJob.jsx";
import MyApplications from "./components/Application/MyApplications.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Application from "./components/Application/Application.jsx";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/auth/getuser",
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsAuthorized(true);
        setUser(response.data.user);
      } else {
        setIsAuthorized(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsAuthorized(false);
      console.error("Error fetching user:", error.response);
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  useEffect(() => {
    if (
      window.location.pathname !== "/register" &&
      window.location.pathname !== "/login"
    ) {
      fetchUser();
    }
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                isAuthorized ? <Home /> : <Navigate to="/login" replace />
              }
            />
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Jobs */}
            <Route path="/job/getall" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/job/post" element={<PostJob />} />
            <Route path="/job/me" element={<MyJobs />} />
            {/* Application */}
            <Route path="/application/:id" element={<Application />} />
            <Route path="/applications/me" element={<MyApplications />} />
            {/* Not found  */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster />
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default App;
