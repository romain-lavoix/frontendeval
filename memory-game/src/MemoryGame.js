import "./MemoryGame.css";
import { useReducer, useRef } from "react";
import { INIT_STATE } from "./constants";
import { reducer } from "./reducer";
import {
  TURN_CARD,
  PAUSE_GAME,
  UNPAUSE_GAME,
  GAME_OVER,
  RESTART_GAME,
} from "./constants";

function MemoryGame() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const { board, gamePaused, gameOver } = state;
  const nbCardsTurnedUp = board.reduce((a, b) => a + (b.turnedUp ? 1 : 0), 0);
  const ref = useRef();

  if (nbCardsTurnedUp === 2 && !gamePaused) {
    dispatch({ type: PAUSE_GAME });
    setTimeout(() => dispatch({ type: UNPAUSE_GAME }), 3000);
  }
  return (
    <div className="main-container">
      <div className="board-container">
        <div>
          <h1>Memory Game</h1>
        </div>
        <div className="board">
          {board.map((card, index) => {
            const { value, turnedUp, removed } = card;
            return (
              <div
                key={index}
                className={`card ${turnedUp ? "" : "turned-down"}`}
                onClick={(e) => {
                  if (!gamePaused) {
                    dispatch({ type: TURN_CARD, payload: index });
                  }
                }}
              >
                <div>{turnedUp ? value : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
