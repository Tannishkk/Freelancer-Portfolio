import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#007bff",
        color: "white",
      }}
    >
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Freelancer App
      </h3>

      <div style={{ display: "flex", gap: "15px" }}>
       <button
  onClick={() => navigate("/")}
  style={{
    background: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  }}
>
  Home
</button>

<button
  onClick={() => navigate("/profile")}
  style={{
    background: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  }}
>
  Profile
</button>

<button
  onClick={logout}
  style={{
    background: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  }}
>
  Logout
</button>
      </div>
    </div>
  );
};

export default Navbar;