import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRss } from '../rss.model';
import { RssService } from '../service/rss.service';

@Component({
  templateUrl: './rss-delete-dialog.component.html',
})
export class RssDeleteDialogComponent {
  rss?: IRss;

  constructor(protected rssService: RssService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rssService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
