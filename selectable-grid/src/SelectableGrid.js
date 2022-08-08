import "./SelectableGrid.css";
import {
  NB_ROWS,
  NB_COLUMNS,
  CELL_WIDTH,
  CELL_HEIGHT,
  SELECTION_INITIAL_STATE,
} from "./constants";
import { range } from "./utils";
import { useRef, useState, useEffect } from "react";

function SelectableGrid() {
  const [selection, setSelection] = useState(SELECTION_INITIAL_STATE);
  const [boundingBox, setBoundingBox] = useState(SELECTION_INITIAL_STATE);
  const [mouseUp, setMouseUp] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

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
          (mouseDown || mouseUp) &&
          cell_rect.left >= selection.left &&
          cell_rect.right <= selection.right &&
          cell_rect.top >= selection.top &&
          cell_rect.bottom <= selection.bottom
        ) {
          cell.style.backgroundColor = mouseUp ? "blue" : "grey";
        } else {
          cell.style.backgroundColor = "unset";
        }
      }
      return null;
    });
  }, [selection, setSelection, mouseUp, setMouseUp, mouseDown, setMouseDown]);

  return (
    <div
      className="grid-container"
      onMouseMove={(e) => {
        if (!mouseDown && !mouseDown && mouseUp) {
          return;
        }
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

        setBoundingBox({ ...select });

        if (
          (select.left < grid.left && select.right < grid.left) ||
          (select.left > grid.right && select.right > grid.right) ||
          (select.top < grid.top && select.bottom < grid.top) ||
          (select.top > grid.bottom && select.bottom > grid.bottom)
        ) {
          setSelection(SELECTION_INITIAL_STATE);
        } else {
          select.left = select.left < grid.left ? grid.left : select.left;
          select.right = select.right > grid.right ? grid.right : select.right;
          select.top = select.top < grid.top ? grid.top : select.top;
          select.bottom =
            select.bottom > grid.bottom ? grid.bottom : select.bottom;

          setSelection(select);
        }
      }}
      onMouseDown={(e) => {
        setMouseDown(true);
        setMouseUp(false);
        setSelection(SELECTION_INITIAL_STATE);
        setBoundingBox(SELECTION_INITIAL_STATE);
        mouseDownCoordsRef.current = { x: e.pageX, y: e.pageY };
      }}
      onMouseUp={() => {
        setMouseUp(true);
        setMouseDown(false);
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
          {mouseDown && (
            <div
              className="bounding-box"
              style={{
                top: boundingBox.top,
                left: boundingBox.left,
                width: boundingBox.right - boundingBox.left,
                height: boundingBox.bottom - boundingBox.top,
              }}
            ></div>
          )}
        </div>
      </>
    </div>
  );
}

export default SelectableGrid;
