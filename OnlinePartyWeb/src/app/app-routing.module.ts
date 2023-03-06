import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MafiaGamePageComponent } from './pages/mafia-game-page/mafia-game-page.component';
import { PetRaceGamePageComponent } from './pages/pet-race-game-page/pet-race-game-page.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'mafia/:id', component: MafiaGamePageComponent},
  {path: 'pet-race/:id', component: PetRaceGamePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
