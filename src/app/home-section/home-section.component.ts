import { Component, Input } from '@angular/core';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { ModalMode } from '../enums/modal-enum';
import * as $ from 'jquery';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.sass'],
})
export class HomeSectionComponent {
  ModalModeEnum = ModalMode;
  players?: Player[];
  isLoading?: boolean;
  // isLoading$: Observable<boolean>;

  constructor(
    private playerService: PlayerService,
    private playerStore: Store<{
      fetchPlayers: {
        players?: Player[];
        isLoading: boolean;
      };
    }>
  ) {
    playerStore.pipe(select('fetchPlayers')).subscribe((data) => {
      const { players, isLoading } = data;
      this.players = players;
      this.isLoading = isLoading;
    });
  }

  ngOnInit() {
    try {
      this.playerService.getPlayers();
    } catch (error) {
      console.error(error);
    }
  }

  buttonHandle(playerId: string, idPrefix: string) {
    $(document.getElementById(`${idPrefix}${playerId}`)!).addClass('show');
    $(document.getElementById(`${idPrefix}${playerId}`)!).css(
      'display',
      'block'
    );
  }

  createButtonHandle() {
    $(document.getElementById(`create_player_modal`)!).addClass('show');
    $(document.getElementById(`create_player_modal`)!).css('display', 'block');
  }

  endGameButtonHandle() {
    $(document.getElementById(`end_game_modal`)!).addClass('show');
    $(document.getElementById(`end_game_modal`)!).css('display', 'block');
  }
}
