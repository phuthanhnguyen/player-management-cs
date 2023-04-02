import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeSectionComponent } from './home-section/home-section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './stores/player-store/player.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeSectionComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({ fetchPlayers: playerReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
