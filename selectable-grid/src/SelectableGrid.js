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
  // FTL: If you look carefully at your code, you only need one enum value to represent
  // the 3 mouse states: 
  // mouseUp: false, mouseDown: false -> 'none'
  // mouseUp: false, mouseDown: true -> 'mousedown'
  // mouseUp: true, mouseDown: false -> 'mouseup'.
  // mouseUp: true, mouseDown: true -> impossible
  // By using two separate boolean flags, you run into the possibility of 
  // creating an impossible state where both mouseUp and mouseDown are true.
  // It'd be better to use an enum instead as fewer state variables is better.
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
          // FTL: There's quite a bit of repetition of overlapping
          // detection. It'd be cleaner to extract them out into a function.
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
  // FTL: This is literally every state value, which means it runs after every render, 
  // and means that you don't need an useEffect for it, you can put it within the rendering.
  }, [selection, setSelection, mouseUp, setMouseUp, mouseDown, setMouseDown]);
  
  return (
    <div
      // FTL: Instead of making this grid-container cover the whole screen,
      // you can attach the events to the window/document instead via `addEventListener()`.
      // But do remember to clean up the events after that.
      className="grid-container"
      onMouseMove={(e) => {
        // FTL: Nit: repeated condition !mouseDown
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
          // FTL: Good optimization here.
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
        // FTL: Dragging is hard to get perfectly right and under interview circumstances
        // there is no time to get all these bugs right. Here are some bugs your code contains:
        // - Right clicking on the page will also trigger a mouse down and starts a selection that
        //   is permanently there even though the mouse button is not pressed down.
        // - Drag as per normal, then move your cursor outside of the window and release, the
        //   selection is still active. 
        // The above can probably be fixed by cancelling the selection and resetting any mouse
        // state if the windows goes out of focus ("blur" event).

        // FTL: The question stated that cells should be unselected only if the
        // use starts dragging a new bounding box. For yours if the user clicks
        // anywhere the selection disappears.
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
                  // FTL: Use external CSS instead of inline styles so that you don't bloat the DOM.
                  // In general we don't use inline styles if the value can be pre-determined.
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
