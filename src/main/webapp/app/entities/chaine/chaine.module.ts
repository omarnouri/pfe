import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChaineComponent } from './list/chaine.component';
import { ChaineDetailComponent } from './detail/chaine-detail.component';
import { ChaineUpdateComponent } from './update/chaine-update.component';
import { ChaineDeleteDialogComponent } from './delete/chaine-delete-dialog.component';
import { ChaineRoutingModule } from './route/chaine-routing.module';

@NgModule({
  imports: [SharedModule, ChaineRoutingModule],
  declarations: [ChaineComponent, ChaineDetailComponent, ChaineUpdateComponent, ChaineDeleteDialogComponent],
  entryComponents: [ChaineDeleteDialogComponent],
})
export class ChaineModule {}
