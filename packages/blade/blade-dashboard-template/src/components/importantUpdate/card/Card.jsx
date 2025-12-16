import "./Card.css";

function Card({ image, tittle, subTittle }) {
  return (
    <div className="card">
      <div className="cardWrapper">
        <div className="cardImage">
          {image}
        </div>
        <div className="cardSection">
          <div className="cardSectionTitle">{tittle}</div>
          <div className="cardSectionSubTitle">{subTittle}</div>
        </div>
      </div>
    </div>
  );
}
export default Card;
