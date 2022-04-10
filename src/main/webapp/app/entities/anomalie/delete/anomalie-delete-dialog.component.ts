import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnomalie } from '../anomalie.model';
import { AnomalieService } from '../service/anomalie.service';

@Component({
  templateUrl: './anomalie-delete-dialog.component.html',
})
export class AnomalieDeleteDialogComponent {
  anomalie?: IAnomalie;

  constructor(protected anomalieService: AnomalieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.anomalieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
