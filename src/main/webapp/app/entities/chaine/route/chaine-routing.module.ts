import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChaineComponent } from '../list/chaine.component';
import { ChaineDetailComponent } from '../detail/chaine-detail.component';
import { ChaineUpdateComponent } from '../update/chaine-update.component';
import { ChaineRoutingResolveService } from './chaine-routing-resolve.service';

const chaineRoute: Routes = [
  {
    path: '',
    component: ChaineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChaineDetailComponent,
    resolve: {
      chaine: ChaineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChaineUpdateComponent,
    resolve: {
      chaine: ChaineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChaineUpdateComponent,
    resolve: {
      chaine: ChaineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chaineRoute)],
  exports: [RouterModule],
})
export class ChaineRoutingModule {}
