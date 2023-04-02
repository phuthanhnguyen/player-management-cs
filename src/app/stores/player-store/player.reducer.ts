import { createReducer, on } from '@ngrx/store';
import { fetchPlayers } from './player.actions';
import { Player } from 'src/app/models/player.model';

export const initialState: { players?: Player[]; isLoading: boolean } = {
  players: [],
  isLoading: true,
};

export const playerReducer = createReducer(
  initialState,
  on(fetchPlayers, (state, { payload }) => {
    if (payload.players) return payload;
    else return { ...state, isLoading: false };
  })
);
