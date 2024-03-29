import { random } from "./utils";

export const GRID_SIZE = 15;
export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_RIGHT = "MOVE_RIGHT";
export const MOVE_UP = "MOVE_UP";
export const MOVE_DOWN = "MOVE_DOWN";
export const GAME_OVER = "GAME_OVER";
export const CHANGE_DIRECTION = "CHANGE_DIRECTION";
export const APPLE_COLLECTED = "APPLE_COLLECTED";
export const RESTART_GAME = "RESTART_GAME";
export const START_GAME = "START_GAME";

// FTL: The apple position cannot be determine without caring about the current snake position
// as it can overlap with the snake positions.
export const APPLE_INIT_POSITION = {
  x: random(0, GRID_SIZE),
  y: random(0, GRID_SIZE),
};
export const SNAKE_INIT_POSITION = [
  {
    x: Math.floor(GRID_SIZE / 2),
    y: Math.floor(GRID_SIZE / 2),
  },
];

// FTL: It'd be better to group related state properties 
// together instead of having a flat object.
// 1. Snake-related properties
// 2. Apple position
// 3. Game-related properties
export const INIT_STATE = {
  applePosition: APPLE_INIT_POSITION,
  snakePosition: SNAKE_INIT_POSITION,
  snakeLength: 3,
  snakeDirection: MOVE_RIGHT,
  snakeSpeed: 300,
  score: 0,
  gameOver: false,
  startGame: false,
};
