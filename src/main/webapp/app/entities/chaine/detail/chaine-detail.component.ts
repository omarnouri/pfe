import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChaine } from '../chaine.model';

@Component({
  selector: 'sopra-chaine-detail',
  templateUrl: './chaine-detail.component.html',
})
export class ChaineDetailComponent implements OnInit {
  chaine: IChaine | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chaine }) => {
      this.chaine = chaine;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
