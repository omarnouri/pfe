import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RssComponent } from './list/rss.component';
import { RssDetailComponent } from './detail/rss-detail.component';
import { RssUpdateComponent } from './update/rss-update.component';
import { RssDeleteDialogComponent } from './delete/rss-delete-dialog.component';
import { RssRoutingModule } from './route/rss-routing.module';

@NgModule({
  imports: [SharedModule, RssRoutingModule],
  declarations: [RssComponent, RssDetailComponent, RssUpdateComponent, RssDeleteDialogComponent],
  entryComponents: [RssDeleteDialogComponent],
})
export class RssModule {}
