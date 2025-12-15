import "./importantUpdate.css";
import Card from "./card";
import FileText from "./assets/FileText.svg?react";
import Ticket from "./assets/Ticket.svg?react";
import WarningOctagon from "./assets/WarningOctagon.svg?react";

function ImportantUpdate() {
  return (
    <div className="importantUpdateContainer">
      <div className="importantUpdateTitleContainer">
        <div className="importantUpdateTitle">Important Updates</div>
        <div className="importantUpdateSubHeading"> (8)</div>
      </div>

      <div className="cardContainer">
        <Card
          image={<Ticket />}
          tittle="4 Open Tickets"
          subTittle="Please add required details for faster resolution       "
        />
        <Card
          image={<WarningOctagon />}
          tittle="1 Pending Review"
          subTittle="Please provide feedback for further progress"
        />
        <Card
          image={<FileText />}
          tittle="2 Failed Payments"
          subTittle="Please add required details for faster resolution"
        />
      </div>
    </div>
  );
}

export default ImportantUpdate;
