import {
  TURN_CARD,
  PAUSE_GAME,
  UNPAUSE_GAME,
  GAME_OVER,
  RESTART_GAME,
} from "./constants";

export const reducer = (state, action) => {
  console.log(
    `${action.type} ${action.payload !== undefined ? action.payload : ""}`
  );
  let newBoard = null;
  switch (action.type) {
    case TURN_CARD:
      const index = action.payload;
      newBoard = [...state.board];
      newBoard[index] = {
        ...newBoard[index],
        turnedUp: !newBoard[index].turnedUp,
      };

      const nbCardsTurnedUp = newBoard.reduce(
        (a, b) => a + (b.turnedUp ? 1 : 0),
        0
      );

      return {
        ...state,
        board: newBoard,
      };
    case PAUSE_GAME:
      newBoard = [...state.board];

      return {
        ...state,
        gamePaused: true,
      };
    case UNPAUSE_GAME:
      newBoard = state.board.map((card) =>
        card.turnedUp ? { ...card, turnedUp: false } : card
      );
      return {
        ...state,
        board: newBoard,
        gamePaused: false,
      };
    case GAME_OVER:
      return {
        ...state,
      };
    case RESTART_GAME:
      return {
        ...state,
      };
    default:
      return state;
  }
};
