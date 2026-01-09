import "./payment.css";
import graphImage from './graph.png';

function PaymentOverview() {
  return (
    <div className="paymentContainer">
      <div className="paymentOverviewTitleContainer">
        <div className="paymentOverviewTitle">Payment Overview</div>
      </div>
      <div className="paymentDataContainer">
        <div className="dataContainer">
          <div className="dataTile">
            <span className="dataTileTitle"> Collected amount </span>
            <div className="dataTileValueContainer">
              <span className="dataTileValue"> ₹39,00,000 </span>
              <span className="dataTileValuePercentage"> +2.5% </span>
              <span className="dataTitleValueRoughValue">(₹5600)</span>
            </div>
          </div>
          <div className="dataValueTile">
            <span className="dataTileTitle"> Refunds </span>
            <div className="dataTileValueContainer">
              <span className="dataTileValue"> ₹1,000 </span>
              <span className="dataTileValuePercentage"> +14% </span>
              <span className="dataTitleValueRoughValue">(₹5600)</span>
            </div>
          </div>
          <hr className="dataTileDivider" />
          <div className="dataValueTile">
            <span className="dataTileTitle"> Disputes </span>
            <div className="dataTileValueContainer">
              <span className="dataTileValue"> ₹1,000 </span>
              <span className="dataTileValuePercentage"> +14% </span>
              <span className="dataTitleValueRoughValue">(₹5600)</span>
            </div>
          </div>
        </div>
        <div className="graphContainer">
            <img src={graphImage} alt="graph" width='100%' height='100%'/>
            <div className="checkBoxContainer">

            </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentOverview;
