import RazorpayLogo from "../../assets/razorpaylogo.svg";
import PluseIcon from '../../assets/navbar/pluse.svg?react';
import Notification from '../../assets/navbar/notification.svg?react';

import "./navbar.css";
function Navbar() {
  return (
    <div className="navbar">
      <div className="navBarContainer">
      <img src={RazorpayLogo} alt="Razorpay Logo" />
      <div className="navbar-items-container ">
        <div className="navbar-item navbar-item-selected">Payments</div>
        <div className="navbar-item">NeoBanking</div>
        <div className="navbar-item">Payroll</div>
        <div className="navbar-item">Parterns</div>
        <div className="navbar-item">+ More</div>
      </div>
      <div className="navBarActions">
        <PluseIcon />
        <Notification />
        <button className="userButton"> A </button>
      </div>
      </div>
    </div>
  );
}

export default Navbar;
