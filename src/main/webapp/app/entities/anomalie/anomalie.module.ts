import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnomalieComponent } from './list/anomalie.component';
import { AnomalieDetailComponent } from './detail/anomalie-detail.component';
import { AnomalieUpdateComponent } from './update/anomalie-update.component';
import { AnomalieDeleteDialogComponent } from './delete/anomalie-delete-dialog.component';
import { AnomalieRoutingModule } from './route/anomalie-routing.module';

@NgModule({
  imports: [SharedModule, AnomalieRoutingModule],
  declarations: [AnomalieComponent, AnomalieDetailComponent, AnomalieUpdateComponent, AnomalieDeleteDialogComponent],
  entryComponents: [AnomalieDeleteDialogComponent],
})
export class AnomalieModule {}
