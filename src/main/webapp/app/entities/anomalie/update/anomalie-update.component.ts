import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAnomalie, Anomalie } from '../anomalie.model';
import { AnomalieService } from '../service/anomalie.service';
import { IChaine } from 'app/entities/chaine/chaine.model';
import { ChaineService } from 'app/entities/chaine/service/chaine.service';

@Component({
  selector: 'sopra-anomalie-update',
  templateUrl: './anomalie-update.component.html',
})
export class AnomalieUpdateComponent implements OnInit {
  isSaving = false;

  chainesSharedCollection: IChaine[] = [];

  editForm = this.fb.group({
    id: [],
    msgAno: [null, [Validators.required]],
    msgSol: [],
    chaine: [],
  });

  constructor(
    protected anomalieService: AnomalieService,
    protected chaineService: ChaineService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ anomalie }) => {
      this.updateForm(anomalie);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const anomalie = this.createFromForm();
    if (anomalie.id !== undefined) {
      this.subscribeToSaveResponse(this.anomalieService.update(anomalie));
    } else {
      this.subscribeToSaveResponse(this.anomalieService.create(anomalie));
    }
  }

  trackChaineById(index: number, item: IChaine): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnomalie>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(anomalie: IAnomalie): void {
    this.editForm.patchValue({
      id: anomalie.id,
      msgAno: anomalie.msgAno,
      msgSol: anomalie.msgSol,
      chaine: anomalie.chaine,
    });

    this.chainesSharedCollection = this.chaineService.addChaineToCollectionIfMissing(this.chainesSharedCollection, anomalie.chaine);
  }

  protected loadRelationshipsOptions(): void {
    this.chaineService
      .query()
      .pipe(map((res: HttpResponse<IChaine[]>) => res.body ?? []))
      .pipe(map((chaines: IChaine[]) => this.chaineService.addChaineToCollectionIfMissing(chaines, this.editForm.get('chaine')!.value)))
      .subscribe((chaines: IChaine[]) => (this.chainesSharedCollection = chaines));
  }

  protected createFromForm(): IAnomalie {
    return {
      ...new Anomalie(),
      id: this.editForm.get(['id'])!.value,
      msgAno: this.editForm.get(['msgAno'])!.value,
      msgSol: this.editForm.get(['msgSol'])!.value,
      chaine: this.editForm.get(['chaine'])!.value,
    };
  }
}
