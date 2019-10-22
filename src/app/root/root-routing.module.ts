import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../start/start.module').then(m => m.StartModule),
      },
      {
        path: 'game',
        loadChildren: () => import('../game/game.module').then(m => m.GameModule),
      },
      {
        path: 'player',
        loadChildren: () => import('../player/player.module').then(m => m.PlayerModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {
}
