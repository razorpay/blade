import "./heroSection.css";
import { GlassPill } from "../common/glassPill";
import PluseIcon from "../../assets/hero/pluse.svg?react";
import MoneyHand from "../../assets/hero/IconMoneyHand.svg?react";
import IconReceiptCheck from "../../assets/hero/IconReceiptCheck.svg?react";
import PinImage from "../../assets/hero/pin.svg?react";
import ArrowUp from "../../assets/hero/arrowUp.svg?react";
import GradientBlinds from "./gradient";
import imagePath from "./image.png";

function HeroSection() {
  return (
    <div className="heroSection">
      <div className="heroSectionBackground">
        <GradientBlinds imagePath={imagePath} />
      </div>
      <div className="raySection">
        <span className="raySectionTitle">
          {" "}
          Find something. Ask anything. Ray AI.
        </span>
        <div className="searchOptionContainer">
          <div className="raySectionInput">
            <span className="rayText"> Ask Anything...</span>
            <div className="buttonContainer">
              <button className="pinImageButton">
                <PinImage />
              </button>
              <button class="arrowUpButton">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                  />
                </svg>
                <div class="bottom-key-light"></div>
              </button>
            </div>
          </div>
          <div className="glassPillContainer">
            <GlassPill text="My settlements" icon={<IconReceiptCheck />} />
            <GlassPill text="Issue refund?" icon={<MoneyHand />} />
            <GlassPill text="Analyze sales" icon={<PluseIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
