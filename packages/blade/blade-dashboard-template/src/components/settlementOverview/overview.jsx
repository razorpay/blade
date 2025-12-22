import "./overview.css";
import RefreshIcon from "../../assets/otherSection/refresh.svg?react";
import DoubleGreenTick from "../../assets/settlementOverview/doubleTick.svg?react";
import Clock from "../../assets/settlementOverview/clock.svg?react";
import Calendar from "../../assets/settlementOverview/calendar.svg?react";

function Overview() {
  return (
    <div className="overview">
      <div className="overviewSection">
        <div className="mainHeading">
          <span className="overviewTitle"> Settlement Overview</span>
          <span className="overviewSubTitle">2 min ago </span>
          <div className="refreshIcon">
            {" "}
            <RefreshIcon />
          </div>
        </div>
        <div>
          <span className="sideHeading">View all settlements</span>
        </div>
      </div>
      <div className="overviewCardContainer">
        <div className="mainWrapper">
          <div className="settlementCardContainer">
            <div className="containerCardWrapper">
              <div className="settlementCard">
                <div className="settlementCardTextContainer">
                  <DoubleGreenTick />
                  <span className="settlementCardText">
                    Deposited Yesterday
                  </span>
                </div>
                <div className="rupeeValueContainer">
                  <span className="rupeeValue"> ₹ 39k </span>
                  <span className="rupeeValueText"> View breakup</span>
                </div>
              </div>
              <hr className="divider" />
              <div className="settlementCard">
                <div className="settlementCardTextContainer">
                  <Clock />
                  <span className="settlementCardText">
                    Depositing Today by 9PM
                  </span>
                </div>
                <div className="rupeeValueContainer">
                  <span className="rupeeValue"> ₹ 24k </span>
                  <span className="rupeeValueText"> View breakup</span>
                </div>
              </div>
              <hr className="divider" />
              <div className="settlementCard">
                <div className="settlementCardTextContainer">
                  <Calendar />
                  <span className="settlementCardText disabled">
                    Next Tomorrow
                  </span>
                </div>
                <div className="rupeeValueContainer">
                  <span className="rupeeValue disabled"> ₹ --- </span>
                  <span className="rupeeValueText disabled">
                    {" "}
                    View eligible transactions
                  </span>
                </div>
              </div>
            </div>
            <div className="otherCard">
              <span className="title">Available balances</span>
              <span className="subText">₹ 12k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
