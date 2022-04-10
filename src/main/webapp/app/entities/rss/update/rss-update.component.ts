import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRss, Rss } from '../rss.model';
import { RssService } from '../service/rss.service';

@Component({
  selector: 'sopra-rss-update',
  templateUrl: './rss-update.component.html',
})
export class RssUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required]],
    url: [null, [Validators.required]],
    estActive: [],
  });

  constructor(protected rssService: RssService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rss }) => {
      this.updateForm(rss);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rss = this.createFromForm();
    if (rss.id !== undefined) {
      this.subscribeToSaveResponse(this.rssService.update(rss));
    } else {
      this.subscribeToSaveResponse(this.rssService.create(rss));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRss>>): void {
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

  protected updateForm(rss: IRss): void {
    this.editForm.patchValue({
      id: rss.id,
      titre: rss.titre,
      url: rss.url,
      estActive: rss.estActive,
    });
  }

  protected createFromForm(): IRss {
    return {
      ...new Rss(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      url: this.editForm.get(['url'])!.value,
      estActive: this.editForm.get(['estActive'])!.value,
    };
  }
}
