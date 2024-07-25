import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

export const Context = createContext({
  isAuthorized: false,
  user: {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    localStorage.getItem("isAuthorized") === "true"
  );

  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    console.log("Retrieved user from local storage:", user);
    try {
      return user ? JSON.parse(user) : {};
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return {};
    }
  };

  const [user, setUser] = useState(getUserFromLocalStorage);

  useEffect(() => {
    console.log("Updating localStorage with:", { isAuthorized, user });
    localStorage.setItem("isAuthorized", isAuthorized);
    localStorage.setItem("user", JSON.stringify(user));
  }, [isAuthorized, user]);

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser: (newUser) => {
          if (newUser) {
            console.log("Setting user:", newUser);
            setUser(newUser);
          } else {
            console.warn("Attempted to set user to an invalid value:", newUser);
          }
        },
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
