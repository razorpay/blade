import "./productsForYou.css";
import Image1 from "../../assets/images/screen1.png";
import Image2 from "../../assets/images/screen2.png";
import Image3 from "../../assets/images/screen3.png";

function ProductCard({ image, title, description }) {
  return (
    <div className="productCard">
      <div className="productCardImage">
        <img src={image} alt={title} width="100%" height="100%" />
      </div>
      {/* <div className="blueContainer">
        <div className="blurLayer blurLayer1"></div>
        <div className="blurLayer blurLayer2"></div>
        <div className="blurLayer blurLayer3"></div>
      </div> */}

      <div className="productCardContent">
        <div className="productCardTextSection">
          <div className="productCardTitle">{title}</div>
          <div className="productCardDescription">{description}</div>
        </div>
        <div className="buttonSection">
          {/* <button className="signUp">Sign Up</button> */}
          <button class="signUp">
            <span class="btn-text">Sign up</span>

            <div class="bottom-key-light"></div>
          </button>
          <span className="knowMore">Know More </span>
        </div>
      </div>
    </div>
  );
}

function ProductsForYou() {
  return (
    <div className="productsForYouContainer">
      <div className="productsForYouTitle">Products For You</div>
      <div className="cardContainer">
        <ProductCard
          image={Image1}
          title="API & Bulk Payouts"
          description="Make multiple payouts with a single click from your dashboard"
        />
        <ProductCard
          image={Image2}
          title="Vender Payouts"
          description="Streamline vendor payouts: Invoices, TDS, payment, accounting, etc"
        />
        <ProductCard
          image={Image3}
          title="Payment Links"
          description="Share payout links for instant payments, no bank details needed"
        />
      </div>
    </div>
  );
}

export default ProductsForYou;
