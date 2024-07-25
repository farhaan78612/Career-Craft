import React, { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection.jsx";
import HowItWorks from "./HowItWorks.jsx";
import PopularCategories from "./PopularCategories.jsx";
import PopularCompanies from "./PopularCompanies.jsx";
const Home = () => {
  const { isAuthorized } = useContext(Context);

  if (!isAuthorized) {
    <Navigate to={"/login"} />;
  }
  return (
    <section className="homePage page">
      <HeroSection />
      <HowItWorks />
      <PopularCategories />
      <PopularCompanies />
    </section>
  );
};

export default Home;
