import { Component, Input } from '@angular/core';
import * as $ from 'jquery';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { ModalMode } from '../enums/modal-enum';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent {
  ModalModeEnum = ModalMode;

  @Input() player?: Player;
  @Input() mode!: ModalMode;

  scoreInput: number | undefined;
  nicknameInput: string | undefined;
  submitEnabled: boolean = false;
  modalId: string = '';
  modalLabel: string = '';
  modalHeaderColor: string = '';
  isValidNickname: boolean = true;
  isValidScore: boolean = true;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    switch (this.mode) {
      case ModalMode.EditMode:
        this.modalId = `edit_player_${this.player?._id}`;
        this.modalLabel = `Edit player: ${this.player?.nickname}`;
        this.modalHeaderColor = 'modal-header-warning';
        break;
      case ModalMode.ReadMode:
        this.modalId = `view_player_${this.player?._id}`;
        this.modalLabel = `Player: ${this.player?.nickname}`;
        this.modalHeaderColor = 'modal-header-info';
        break;
      case ModalMode.DeleteMode:
        this.modalId = `delete_player_${this.player?._id}`;
        this.modalLabel = `Warning!`;
        this.modalHeaderColor = 'modal-header-danger';
        break;
      case ModalMode.EndGame:
        this.modalId = `end_game_modal`;
        this.modalLabel = `Warning!`;
        this.modalHeaderColor = 'modal-header-danger';
        break;
      case ModalMode.CreateMode:
        this.modalId = `create_player_modal`;
        this.modalLabel = 'Create player';
        this.modalHeaderColor = 'modal-header-warning';
        break;
      default:
    }
  }

  handleOnChangeNickname(event: Event) {
    const element = event.target as HTMLInputElement;
    this.nicknameInput = element.value;
    this.isValidNickname = true;
    this.activeSubmitButton();
  }

  handleOnChangeScore(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.scoreInput = parseInt(element.value);
    this.isValidScore = !isNaN(this.scoreInput!) || element.value === '';
    this.activeSubmitButton();
  }

  close() {
    $(document.getElementById(this.modalId)!).removeClass('show');
    $(document.getElementById(this.modalId)!).css('display', 'none');
    this.refreshInputs();
  }

  submit() {
    if (this.mode === ModalMode.CreateMode && this.nicknameInput) {
      this.playerService
        .createPlayer(this.nicknameInput, this.scoreInput)
        .subscribe({
          next: (res) => {
            if (res.status === 201) {
              this.playerService.getPlayers();
              this.close();
            }
          },
          error: (e) => (this.isValidNickname = false),
        });
    }
    if (this.mode === ModalMode.EditMode && this.scoreInput && this.player) {
      this.playerService
        .updatePlayerScore(this.player._id, this.scoreInput)
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.playerService.getPlayers();
              this.refreshInputs();
              this.close();
            }
          },
          error: (e) => console.error(e),
        });
    }

    if (this.mode === ModalMode.DeleteMode && this.player) {
      this.playerService.deletePlayer(this.player._id).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.playerService.getPlayers();
            this.close();
          }
        },
        error: (e) => console.error(e),
      });
    }

    if (this.mode === ModalMode.EndGame) {
      this.playerService.deletePlayers().subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.playerService.getPlayers();
            this.close();
          }
        },
        error: (e) => console.error(e),
      });
    }
  }

  private activeSubmitButton() {
    if (this.mode === this.ModalModeEnum.EditMode) {
      this.submitEnabled = !isNaN(this.scoreInput!);
    } else if (this.mode === this.ModalModeEnum.CreateMode) {
      this.submitEnabled =
        this.nicknameInput !== undefined && !isNaN(this.scoreInput!);
    }
  }

  private refreshInputs() {
    this.scoreInput = undefined;
    this.nicknameInput = undefined;
    this.isValidNickname = true;
    this.isValidScore = true;
    $(document.getElementById('createPlayerForm')!).trigger('reset');
    $(document.getElementById('editPlayerForm_' + this.modalId)!).trigger(
      'reset'
    );
  }
}
