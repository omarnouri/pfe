import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RssComponent } from '../list/rss.component';
import { RssDetailComponent } from '../detail/rss-detail.component';
import { RssUpdateComponent } from '../update/rss-update.component';
import { RssRoutingResolveService } from './rss-routing-resolve.service';

const rssRoute: Routes = [
  {
    path: '',
    component: RssComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RssDetailComponent,
    resolve: {
      rss: RssRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RssUpdateComponent,
    resolve: {
      rss: RssRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RssUpdateComponent,
    resolve: {
      rss: RssRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rssRoute)],
  exports: [RouterModule],
})
export class RssRoutingModule {}
