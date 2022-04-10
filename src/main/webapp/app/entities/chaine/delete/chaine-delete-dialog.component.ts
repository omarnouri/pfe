import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChaine } from '../chaine.model';
import { ChaineService } from '../service/chaine.service';

@Component({
  templateUrl: './chaine-delete-dialog.component.html',
})
export class ChaineDeleteDialogComponent {
  chaine?: IChaine;

  constructor(protected chaineService: ChaineService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chaineService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
