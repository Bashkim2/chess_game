import { Status } from "../constant";
import actionTypes from "./actionTypes";
export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      let { position, turn } = state;
      position = [...position, action.payload.newPosition];

      turn = turn === "w" ? "b" : "w";

      return {
        ...state,
        position,
        turn,
      };
    }

    case actionTypes.GENERATE_CANDIDATE_MOVES: {
      const { candidateMoves } = action.payload;
      return {
        ...state,
        candidateMoves,
      };
    }

    case actionTypes.CLEAR_CANDIDATE_MOVES: {
      return {
        ...state,
        candidateMoves: [],
      };
    }

    case actionTypes.PROMOTION_OPEN: {
      return {
        ...state,
        status: Status.promoting,
        promotionSquare: { ...action.payload },
      };
    }

    case actionTypes.PROMOTION_CLOSE: {
      return {
        ...state,
        status: Status.ongoing,
        promotionSquare: null,
      };
    }

    case actionTypes.CAN_CASTLE: {
      let { turn, castleDirection } = state;

      castleDirection[turn] = action.payload;

      return {
        ...state,
        castleDirection,
      };
    }

    case actionTypes.STALEMATE: {
      return {
        ...state,
        status: Status.stalemate,
      };
    }

    default:
      return state;
  }
};
