const NB_CARDS = 36;
const BOARD = [];

export const INIT_STATE = {
  board: BOARD,
  gameOver: false,
  gamePaused: false,
};

// let's add 1-18 value cards 2 times
for (let i = 0; i < NB_CARDS / 2; i++) {
  const card = {
    value: i + 1,
    turnedUp: false,
    removed: false,
  };
  BOARD.push(card);
  BOARD.push({ ...card });
}

// let's shuffle
for (let i = 0; i < 10000; i++) {
  const rnd1 = Math.floor(Math.random() * NB_CARDS);
  const rnd2 = Math.floor(Math.random() * NB_CARDS);
  const swap = BOARD[rnd2];

  BOARD[rnd2] = BOARD[rnd1];
  BOARD[rnd1] = swap;
}

export const TURN_CARD = "TURN_CARD";
export const PAUSE_GAME = "PAUSE_GAME";
export const UNPAUSE_GAME = "UNPAUSE_GAME";
export const GAME_OVER = "GAME_OVER";
export const RESTART_GAME = "RESTART_GAME";
