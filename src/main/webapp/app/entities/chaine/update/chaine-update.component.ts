import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IChaine, Chaine } from '../chaine.model';
import { ChaineService } from '../service/chaine.service';

@Component({
  selector: 'sopra-chaine-update',
  templateUrl: './chaine-update.component.html',
})
export class ChaineUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required]],
    process: [null, [Validators.required]],
  });

  constructor(protected chaineService: ChaineService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chaine }) => {
      this.updateForm(chaine);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chaine = this.createFromForm();
    if (chaine.id !== undefined) {
      this.subscribeToSaveResponse(this.chaineService.update(chaine));
    } else {
      this.subscribeToSaveResponse(this.chaineService.create(chaine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChaine>>): void {
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

  protected updateForm(chaine: IChaine): void {
    this.editForm.patchValue({
      id: chaine.id,
      libelle: chaine.libelle,
      process: chaine.process,
    });
  }

  protected createFromForm(): IChaine {
    return {
      ...new Chaine(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      process: this.editForm.get(['process'])!.value,
    };
  }
}
