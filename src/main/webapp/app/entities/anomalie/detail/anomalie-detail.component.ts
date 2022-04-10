import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnomalie } from '../anomalie.model';

@Component({
  selector: 'sopra-anomalie-detail',
  templateUrl: './anomalie-detail.component.html',
})
export class AnomalieDetailComponent implements OnInit {
  anomalie: IAnomalie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ anomalie }) => {
      this.anomalie = anomalie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
