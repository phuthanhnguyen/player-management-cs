import { createAction, props } from '@ngrx/store';
import { Player } from 'src/app/models/player.model';

export const fetchPlayers = createAction(
  'Fetch all players',
  props<{ payload: { players?: Player[]; isLoading: boolean } }>()
);
