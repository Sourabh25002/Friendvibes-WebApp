import React, { useContext } from "react";
import logo from "../img/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";// use {Link} instead of a href of html so that page doesn't refresh everytime we go to another page by link
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
export default function Navbar({ login }) {//always give componet to be exported in capital letter
 const navigate=useNavigate()
  const { setModalOpen } = useContext(LoginContext);
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {//to show signup and sign in option in navbar when user has not logged in  
      return [
        <>
          <Link to="/profile">
            <li className="weighNav">Profile</li>
          </Link>
          <Link to="/createPost">
          <li className="weighNav"> Create Post</li>
           </Link>
          <Link style={{ marginLeft: "20px" }} to="/followingpost">
          <li className="weighNav">  My Following </li>
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li className="weighNav">SignUp</li>
          </Link>
          <Link to="/signin">
            <li className="weighNav">SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <img src={logo} alt="" onClick={()=>{navigate("/")}}/>
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}