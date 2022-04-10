import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRss } from '../rss.model';
import { RssService } from '../service/rss.service';
import { RssDeleteDialogComponent } from '../delete/rss-delete-dialog.component';

@Component({
  selector: 'sopra-rss',
  templateUrl: './rss.component.html',
})
export class RssComponent implements OnInit {
  rsses?: IRss[];
  isLoading = false;

  constructor(protected rssService: RssService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.rssService.query().subscribe(
      (res: HttpResponse<IRss[]>) => {
        this.isLoading = false;
        this.rsses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRss): number {
    return item.id!;
  }

  delete(rss: IRss): void {
    const modalRef = this.modalService.open(RssDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rss = rss;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
