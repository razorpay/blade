import "./topInsights.css";
import Up from "../../assets/indicators/up.svg?react";
import Down from "../../assets/indicators/down.svg?react";
import Left from "../../assets/indicators/left.svg?react";
import GreenGraph from "../../assets/indicators/greenGraph.svg?react";
import RedGraph from "../../assets/indicators/redGraph.svg?react";

function GraphCard({ name, movement, value, delta }) {
  const movementClass = movement === "positive" ? "positive" : "negative";
  const GraphImage = movement === "positive" ? GreenGraph : RedGraph;

  return (
    <div className="graphCardContainer">
      <div className="title">
        <span> {name} </span>
        <Left />
      </div>
      <div className="graphImageContainer">
        <div className="graphDivWrapper">
          <div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <div className="valueContainer">
                {" "}
                <span className="value">{value}</span>{" "}
                <span
                  className={
                    movementClass === "positive" ? "positive" : "negative"
                  }
                >
                  {movementClass === "positive" ? <Up /> : <Down />} 40
                </span>{" "}
              </div>
              <div>
                <span className="sideHeading"> since prev week</span>
              </div>
            </div>
          </div>
          <div>
            {" "}
            <GraphImage />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopInsights() {
  return (
    <div className="topInsightsContainer">
      <div className="insightsHeading">Top Insights</div>
      <div className="grapCardContainer">
        <GraphCard name="Total Revenue" movement="positive" value="140" />
        <GraphCard
          name="Payment Failures Count"
          movement="negative"
          value="80"
        />
        <GraphCard name="Refunds Conuts" movement="positive" value="40" />
        <GraphCard
          name="Refunds Failures Count"
          movement="positive"
          value="10"
        />
      </div>
    </div>
  );
}

export default TopInsights;
