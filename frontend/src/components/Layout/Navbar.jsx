import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log("Navbar - User:", user);
    console.log("Navbar - Is Authorized:", isAuthorized);
  }, [user, isAuthorized]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/auth/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      localStorage.removeItem("isAuthorized");
      localStorage.removeItem("user");
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src="/careercraftBlack.png" alt="logo" />
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to="/" onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/job/getall" onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/applications/me" onClick={() => setShow(false)}>
                {user.role === "Employer"
                  ? "APPLICANT'S APPLICATIONS"
                  : "MY APPLICATIONS"}
              </Link>
            </li>
          )}
          {user?.role === "Employer" && (
            <>
              <li>
                <Link to="/job/post" onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to="/job/me" onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          )}
          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
