import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChaine } from '../chaine.model';
import { ChaineService } from '../service/chaine.service';
import { ChaineDeleteDialogComponent } from '../delete/chaine-delete-dialog.component';

@Component({
  selector: 'sopra-chaine',
  templateUrl: './chaine.component.html',
})
export class ChaineComponent implements OnInit {
  chaines?: IChaine[];
  isLoading = false;

  constructor(protected chaineService: ChaineService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chaineService.query().subscribe(
      (res: HttpResponse<IChaine[]>) => {
        this.isLoading = false;
        this.chaines = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IChaine): number {
    return item.id!;
  }

  delete(chaine: IChaine): void {
    const modalRef = this.modalService.open(ChaineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chaine = chaine;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
