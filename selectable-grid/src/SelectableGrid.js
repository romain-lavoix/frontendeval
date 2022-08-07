import "./SelectableGrid.css";
import { NB_ROWS, NB_COLUMNS, CELL_WIDTH, CELL_HEIGHT } from "./constants";
import { range } from "./utils";
import { useRef, useState, useEffect } from "react";

function SelectableGrid() {
  const [selection, setSelection] = useState({});
  const mouseDownCoordsRef = useRef({
    x: 0,
    y: 0,
  });
  const gridRef = useRef({});

  useEffect(() => {
    range(0, NB_ROWS * NB_COLUMNS - 1).map((id) => {
      const cell = document.getElementById(`cell-${id}`);
      if (cell) {
        const cell_rect = cell.getBoundingClientRect();
        if (
          cell_rect.left >= selection.left &&
          cell_rect.right <= selection.right &&
          cell_rect.top >= selection.top &&
          cell_rect.bottom <= selection.bottom
        ) {
          cell.style.backgroundColor = "blue";
        } else {
          cell.style.backgroundColor = "unset";
        }
      }
    });
  }, [selection, setSelection]);

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
          setSelection(select);
        } else {
          select.left = select.left < grid.left ? grid.left : select.left;
          select.right = select.right > grid.right ? grid.right : select.right;
          select.top = select.top < grid.top ? grid.top : select.top;
          select.bottom =
            select.bottom > grid.bottom ? grid.bottom : select.bottom;

          setSelection(select);
        }
      }}
    >
      <>
        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateRows: `repeat(${NB_ROWS}, 1fr)`,
            gridTemplateColumns: `repeat(${NB_COLUMNS}, 1fr)`,
            zIndex: 2,
          }}
        >
          {range(0, NB_ROWS * NB_COLUMNS - 1).map((idx) => {
            const id = `cell-${idx}`;
            return (
              <div
                key={id}
                id={id}
                className="cell"
                style={{
                  width: `${CELL_WIDTH}px`,
                  height: `${CELL_HEIGHT}px`,
                }}
              ></div>
            );
          })}
        </div>
      </>
    </div>
  );
}

export default SelectableGrid;
