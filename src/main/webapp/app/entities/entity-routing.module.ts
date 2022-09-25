import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'rss',
        data: { pageTitle: 'portailGestionnaireApp.rss.home.title' },
        loadChildren: () => import('./rss/rss.module').then(m => m.RssModule),
      },
      {
        path: 'chaine',
        data: { pageTitle: 'portailGestionnaireApp.chaine.home.title' },
        loadChildren: () => import('./chaine/chaine.module').then(m => m.ChaineModule),
      },
      {
        path: 'anomalie',
        data: { pageTitle: 'portailGestionnaireApp.anomalie.home.title' },
        loadChildren: () => import('./anomalie/anomalie.module').then(m => m.AnomalieModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'portailGestionnaireApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
