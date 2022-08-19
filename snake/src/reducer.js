import {
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_DOWN,
  MOVE_LEFT,
  START_GAME,
  RESTART_GAME,
  INIT_STATE,
  GRID_SIZE,
  GAME_OVER,
  CHANGE_DIRECTION,
  APPLE_COLLECTED,
  SNAKE_INIT_POSITION,
} from "./constants";
import { random } from "./utils";

// FTL: Good use of a reducer. Most games will benefit from the use of reducers 
// and Snake is no exception.
export const reducer = (state, action) => {
  console.log(`${action.type} ${action.payload ? action.payload : ""}`);

  // FTL: Could define this as a function outside of this function.
  // FTL: Nit: use camelCase for variables in JavaScript.
  const move = (snake_position, inc_x, inc_y) => {
    const snake_position_copy = [...snake_position];
    const last = snake_position_copy[snake_position_copy.length - 1];
    snake_position_copy.push({
      x: last.x + inc_x,
      y: last.y + inc_y,
    });
    if (snake_position_copy.length > state.snakeLength) {
      snake_position_copy.shift();
    }
    return snake_position_copy;
  };

  switch (action.type) {
    case MOVE_UP:
      const snakePosition = move(state.snakePosition, 0, -1);
      return {
        ...state,
        snakePosition: move(state.snakePosition, 0, -1),
      };
    case MOVE_DOWN:
      return {
        ...state,
        snakePosition: move(state.snakePosition, 0, 1),
      };
    case MOVE_LEFT:
      return {
        ...state,
        snakePosition: move(state.snakePosition, -1, 0),
      };
    case MOVE_RIGHT:
      return {
        ...state,
        snakePosition: move(state.snakePosition, 1, 0),
      };
    case CHANGE_DIRECTION:
      return {
        ...state,
        snakeDirection: action.payload,
      };
    case APPLE_COLLECTED:
      return {
        ...state,
        score: state.score + 1,
        // FTL: This should be a utility function that takes in the current
        // snake position so that you can generate an apple that
        // doesn't overlap with the snake body. This bug will become
        // very apparent when the snake becomes very long and the chance
        // of overlapping is very high.
        // With such a utility function, it should also be used when
        // generating the initial position as well.
        applePosition: {
          x: random(0, GRID_SIZE),
          y: random(0, GRID_SIZE),
        },
        snakeLength: state.snakeLength + 1,
        // FTL: You likely want to make the snake speed delta in the
        // constants as well.
        snakeSpeed: state.snakeSpeed - 10,
      };
    case GAME_OVER:
      return {
        ...state,
        snakePosition: SNAKE_INIT_POSITION,
        gameOver: true,
      };
    case RESTART_GAME:
      return {
        ...INIT_STATE,
        startGame: true,
      };
    case START_GAME:
      return {
        ...state,
        startGame: true,
      };
    default:
      return state;
  }
};
