import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnomalie } from '../anomalie.model';
import { AnomalieService } from '../service/anomalie.service';
import { AnomalieDeleteDialogComponent } from '../delete/anomalie-delete-dialog.component';

@Component({
  selector: 'sopra-anomalie',
  templateUrl: './anomalie.component.html',
})
export class AnomalieComponent implements OnInit {
  anomalies?: IAnomalie[];
  isLoading = false;

  constructor(protected anomalieService: AnomalieService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.anomalieService.query().subscribe(
      (res: HttpResponse<IAnomalie[]>) => {
        this.isLoading = false;
        this.anomalies = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnomalie): number {
    return item.id!;
  }

  delete(anomalie: IAnomalie): void {
    const modalRef = this.modalService.open(AnomalieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.anomalie = anomalie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
