import "./SelectableGrid.css";
import { HEIGHT, WIDTH } from "./constants";
import { range } from "./utils";
import { useRef, useState } from "react";

function SelectableGrid() {
  const [select, setSelect] = useState({});
  const mouseDownCoordsRef = useRef({
    x: 0,
    y: 0,
  });
  const gridRef = useRef({});

  return (
    <div
      className="grid-container"
      onMouseDown={(e) => {
        mouseDownCoordsRef.current = { x: e.pageX, y: e.pageY };
      }}
      onMouseUp={(e) => {
        const grid = gridRef.current.getBoundingClientRect();
        const select = {};

        if (e.pageX > mouseDownCoordsRef.current.x) {
          select.left = mouseDownCoordsRef.current.x;
          select.right = e.pageX;
        } else {
          select.left = e.pageX;
          select.right = mouseDownCoordsRef.current.x;
        }
        if (e.pageY > mouseDownCoordsRef.current.y) {
          select.top = mouseDownCoordsRef.current.y;
          select.bottom = e.pageY;
        } else {
          select.top = e.pageY;
          select.bottom = mouseDownCoordsRef.current.y;
        }

        if (
          (select.left < grid.left && select.right < grid.left) ||
          (select.left > grid.right && select.right > grid.right) ||
          (select.top < grid.top && select.bottom < grid.top) ||
          (select.top > grid.bottom && select.bottom > grid.bottom)
        ) {
          setSelect(select);
        } else {
          select.left = select.left < grid.left ? grid.left : select.left;
          select.right = select.right > grid.right ? grid.right : select.right;
          select.top = select.top < grid.top ? grid.top : select.top;
          select.bottom =
            select.bottom > grid.bottom ? grid.bottom : select.bottom;

          setSelect(select);
        }
      }}
    >
      <>
        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateRows: `repeat(${HEIGHT}, 1fr)`,
            gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
            zIndex: 2,
          }}
        >
          {range(0, HEIGHT * WIDTH - 1).map((idx) => {
            const id = `cell-${idx}`;
            return <div key={id} id={id} className="cell"></div>;
          })}
        </div>
        <div
          style={{
            position: "fixed",
            top: `${select.top}px`,
            left: `${select.left}px`,
            width: `${select.right - select.left}px`,
            height: `${select.bottom - select.top}px`,
            backgroundColor: "blue",
            zIndex: 1,
          }}
        ></div>
      </>
    </div>
  );
}

export default SelectableGrid;
