import {
  INIT_STATE,
  MOVE_LEFT,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_UP,
  GRID_SIZE,
  CHANGE_DIRECTION,
  APPLE_COLLECTED,
  GAME_OVER,
  RESTART_GAME,
} from "./constants";
import styles from "./Snake.module.css";
import { useReducer, useRef, useEffect } from "react";
import { reducer } from "./reducer";

function Snake() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const directionChangeRef = useRef(null);
  const { applePosition, snakePosition, score, snakeDirection, gameOver } =
    state;
  const grid = [];
  const lastSnakePosition = snakePosition[snakePosition.length - 1];
  const snakePositionSet = new Set();

  snakePosition.forEach((pos, idx) => {
    if (idx !== snakePosition.length - 1) {
      snakePositionSet.add(`${pos.y}-${pos.x}`);
    }
  });

  if (
    lastSnakePosition.x < 0 ||
    lastSnakePosition.x > GRID_SIZE - 1 ||
    lastSnakePosition.y < 0 ||
    lastSnakePosition.y > GRID_SIZE - 1 ||
    (snakePositionSet.has(`${lastSnakePosition.y}-${lastSnakePosition.x}`) &&
      !gameOver)
  ) {
    clearInterval(intervalRef.current);
    dispatch({ type: GAME_OVER });
  }

  if (
    lastSnakePosition.x === applePosition.x &&
    lastSnakePosition.y === applePosition.y
  ) {
    dispatch({ type: APPLE_COLLECTED });
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    grid.push([]);
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i].push("");
    }
  }

  grid[applePosition.y][applePosition.x] = "A";
  snakePosition.forEach((position, idx) => {
    if (grid[position.y]) {
      grid[position.y][position.x] =
        idx === snakePosition.length - 1 ? "H" : "S";
    }
  });

  directionChangeRef.current = () => {
    dispatch({ type: snakeDirection });
  };

  useEffect(() => {
    clearInterval(intervalRef.current);
    containerRef.current.focus();
    intervalRef.current = setInterval(() => {
      directionChangeRef.current();
      return () => clearInterval(intervalRef.current);
    }, 250);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={styles.containerGrid}
      onKeyDown={(e) => {
        switch (e.key) {
          case "a": {
            if (snakeDirection !== MOVE_RIGHT) {
              dispatch({ type: CHANGE_DIRECTION, payload: MOVE_LEFT });
            }
            break;
          }
          case "d": {
            if (snakeDirection !== MOVE_LEFT) {
              dispatch({ type: CHANGE_DIRECTION, payload: MOVE_RIGHT });
            }
            break;
          }
          case "w": {
            if (snakeDirection !== MOVE_DOWN) {
              dispatch({ type: CHANGE_DIRECTION, payload: MOVE_UP });
            }
            break;
          }
          case "s": {
            if (snakeDirection !== MOVE_UP) {
              dispatch({ type: CHANGE_DIRECTION, payload: MOVE_DOWN });
            }
            break;
          }
          case " ": {
            if (gameOver) {
              dispatch({ type: RESTART_GAME });
              intervalRef.current = setInterval(() => {
                directionChangeRef.current();
                return () => clearInterval(intervalRef.current);
              }, 250);
            }
            break;
          }
          default:
        }
      }}
    >
      <div className={styles.board}>
        <div className={styles.score}>
          <h1>{score}</h1>
        </div>
        {gameOver && (
          <div className={styles.gameOverContainer}>
            <div className={styles.gameOverMessage}>
              <div>GAME OVER</div>
              <div>PRESS SPACE TO CONTINUE</div>
            </div>
          </div>
        )}
        <div className={styles.grid}>
          {grid.map((line, i) => {
            return line.map((cell, j) => {
              let backgroundColor;
              if (cell === "A") {
                backgroundColor = "green";
              } else if (cell === "H") {
                backgroundColor = "yellow";
              } else if (cell === "S") {
                backgroundColor = "grey";
              } else {
                backgroundColor = "unset";
              }
              return (
                <div
                  key={`${i}-${j}`}
                  style={{
                    backgroundColor,
                    borderStyle: cell !== "" ? "solid" : "unset",
                  }}
                ></div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

export default Snake;
