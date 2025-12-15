import "./glassPill.css";

function GlassPill({ icon , text}) {
  return (
    <div className="glassPill">
      <div className="icon">{icon} </div>
      <span className="glassPillText">{text}</span>
    </div>
  );
}

export default GlassPill;