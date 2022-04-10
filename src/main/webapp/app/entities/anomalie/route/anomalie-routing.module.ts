import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnomalieComponent } from '../list/anomalie.component';
import { AnomalieDetailComponent } from '../detail/anomalie-detail.component';
import { AnomalieUpdateComponent } from '../update/anomalie-update.component';
import { AnomalieRoutingResolveService } from './anomalie-routing-resolve.service';

const anomalieRoute: Routes = [
  {
    path: '',
    component: AnomalieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnomalieDetailComponent,
    resolve: {
      anomalie: AnomalieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnomalieUpdateComponent,
    resolve: {
      anomalie: AnomalieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnomalieUpdateComponent,
    resolve: {
      anomalie: AnomalieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(anomalieRoute)],
  exports: [RouterModule],
})
export class AnomalieRoutingModule {}
