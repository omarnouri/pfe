import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClient, Client } from '../client.model';
import { ClientService } from '../service/client.service';
import { IRss } from 'app/entities/rss/rss.model';
import { RssService } from 'app/entities/rss/service/rss.service';

@Component({
  selector: 'sopra-client-update',
  templateUrl: './client-update.component.html',
})
export class ClientUpdateComponent implements OnInit {
  isSaving = false;

  rssesSharedCollection: IRss[] = [];

  editForm = this.fb.group({
    id: [],
    nameCl: [null, [Validators.required]],
    logo: [],
    pathLogs: [],
    type: [],
    rsses: [],
  });

  constructor(
    protected clientService: ClientService,
    protected rssService: RssService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.updateForm(client);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const client = this.createFromForm();
    if (client.id !== undefined) {
      this.subscribeToSaveResponse(this.clientService.update(client));
    } else {
      this.subscribeToSaveResponse(this.clientService.create(client));
    }
  }

  trackRssById(index: number, item: IRss): number {
    return item.id!;
  }

  getSelectedRss(option: IRss, selectedVals?: IRss[]): IRss {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClient>>): void {
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

  protected updateForm(client: IClient): void {
    this.editForm.patchValue({
      id: client.id,
      nameCl: client.nameCl,
      logo: client.logo,
      pathLogs: client.pathLogs,
      type: client.type,
      rsses: client.rsses,
    });

    this.rssesSharedCollection = this.rssService.addRssToCollectionIfMissing(this.rssesSharedCollection, ...(client.rsses ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.rssService
      .query()
      .pipe(map((res: HttpResponse<IRss[]>) => res.body ?? []))
      .pipe(map((rsses: IRss[]) => this.rssService.addRssToCollectionIfMissing(rsses, ...(this.editForm.get('rsses')!.value ?? []))))
      .subscribe((rsses: IRss[]) => (this.rssesSharedCollection = rsses));
  }

  protected createFromForm(): IClient {
    return {
      ...new Client(),
      id: this.editForm.get(['id'])!.value,
      nameCl: this.editForm.get(['nameCl'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      pathLogs: this.editForm.get(['pathLogs'])!.value,
      type: this.editForm.get(['type'])!.value,
      rsses: this.editForm.get(['rsses'])!.value,
    };
  }
}
