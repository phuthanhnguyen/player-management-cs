import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Player } from '../models/player.model';
import { config } from '../../config/config';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { fetchPlayers } from '../stores/player-store/player.actions';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private players$: Observable<Player[]>;

  constructor(
    private http: HttpClient,
    private playerStore: Store<{ players: Player[] }>
  ) {
    this.players$ = playerStore.pipe(select('players'));
  }

  createPlayer(
    nickname: string,
    score?: number
  ): Observable<HttpResponse<Player[]>> {
    return this.http.post<Player[]>(
      config.playerUrl,
      { nickname, score: score || 0 },
      { observe: 'response' }
    );
  }

  getPlayers() {
    fetchPlayers({
      payload: { isLoading: true },
    });
    return this.http
      .get<Player[]>(config.playerUrl, { observe: 'response' })
      .subscribe((res) => {
        if (res.status === 200) {
          this.playerStore.dispatch(
            fetchPlayers({
              payload: { players: res.body || [], isLoading: false },
            })
          );
        } else {
          throw new Error(JSON.stringify(res.body));
        }
      });
  }

  deletePlayers(): Observable<HttpResponse<string>> {
    return this.http.delete<string>(config.playerUrl, { observe: 'response' });
  }

  getPlayer(playerId: string): Observable<HttpResponse<Player>> {
    return this.http.get<Player>(`${config.playerUrl}${playerId}`, {
      observe: 'response',
    });
  }

  updatePlayerScore(
    playerId: string,
    score: number
  ): Observable<HttpResponse<Player>> {
    return this.http.put<Player>(
      `${config.playerUrl}${playerId}`,
      { score },
      { observe: 'response' }
    );
  }

  deletePlayer(playerId: string): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${config.playerUrl}${playerId}`, {
      observe: 'response',
    });
  }
}
