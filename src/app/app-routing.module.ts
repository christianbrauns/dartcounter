import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./start/start.module').then(m => m.StartModule),
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
  },
  {
    path: 'player',
    loadChildren: () => import('./player/player.module').then(m => m.PlayerModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
