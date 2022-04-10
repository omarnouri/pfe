import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRss } from '../rss.model';

@Component({
  selector: 'sopra-rss-detail',
  templateUrl: './rss-detail.component.html',
})
export class RssDetailComponent implements OnInit {
  rss: IRss | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rss }) => {
      this.rss = rss;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
