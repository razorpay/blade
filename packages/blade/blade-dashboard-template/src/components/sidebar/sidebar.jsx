import "./sideBar.css";
import HomeIcon from "../../assets/navbar/homeIcon.svg?react";
import LeftRight from "../../assets/navbar/leftRight.svg?react";
import TickIcon from "../../assets/navbar/tick.svg?react";
import ReportsIcon from "../../assets/navbar/report.svg?react";
import CC from "../../assets/navbar/cc.svg?react";
import Payments from "../../assets/navbar/payments.svg?react";
import Tax from "../../assets/navbar/tax.svg?react";
import RayAi from "../../assets/navbar/ray.svg?react";
import ThreeDots from "../../assets/navbar/threedots.svg?react";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sideBarItem sideBarSelectedItem">
        {" "}
        <HomeIcon /> Home{" "}
      </div>
      <div className="sideBarItem">
        {" "}
        <LeftRight /> Transactions{" "}
      </div>
      <div className="sideBarItem">
        {" "}
        <LeftRight /> Settlements{" "}
      </div>
      <div className="sideBarItem">
        {" "}
        <ReportsIcon /> Reports{" "}
      </div>
      <div className="sideBarItem">
        {" "}
        <CC /> Credit Cards
      </div>
      <div className="sideBarItem">
        {" "}
        <Payments /> Vendor Payments
      </div>
      <div className="sideBarItem">
        {" "}
        <Tax /> Tax
      </div>
      <div className="sideBarItem">
        {" "}
        <RayAi /> Ray AI
      </div>
      <div className="sideBarItem">
        {" "}
        <ThreeDots /> More
      </div>
    </div>
  );
}

export default Sidebar;
