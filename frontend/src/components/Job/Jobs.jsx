import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("http://localhost:8080/api/v1/job/get-jobs", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="jobs page">
        <div className="container">
          <h1>ALL AVILABLE JOBS</h1>
          <div className="banner">
            {jobs.jobs &&
              jobs.jobs.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p>{element.title}</p>
                    <p>{element.category}</p>
                    <p>{element.country}</p>
                    <Link to={`/job/${element._id}`}>Job Details</Link>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Jobs;
