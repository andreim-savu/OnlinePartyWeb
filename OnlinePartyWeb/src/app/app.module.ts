import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MafiaGamePageComponent } from './pages/mafia-game-page/mafia-game-page.component';
import { PetRaceGamePageComponent } from './pages/pet-race-game-page/pet-race-game-page.component';
import { PetContainerComponent } from './pages/pet-race-game-page/pet-container/pet-container.component';
import { PerkContainerComponent } from './pages/pet-race-game-page/perk-container/perk-container.component';
import { EquipPerkContainerComponent } from './pages/pet-race-game-page/equip-perk-container/equip-perk-container.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    MafiaGamePageComponent,
    PetRaceGamePageComponent,
    PetContainerComponent,
    PerkContainerComponent,
    EquipPerkContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
