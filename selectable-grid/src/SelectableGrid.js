import "./SelectableGrid.css";
import { HEIGHT, WIDTH } from "./constants";
import { range } from "./utils";

function SelectableGrid() {
  const grid = [];

  return (
    <div className="grid-container">
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${HEIGHT}, 1fr)`,
          gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
        }}
      >
        {range(0, HEIGHT * WIDTH - 1).map((idx) => {
          return <div key={idx} className="cell"></div>;
        })}
      </div>
    </div>
  );
}

export default SelectableGrid;
