jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClientService } from '../service/client.service';
import { IClient, Client } from '../client.model';
import { IRss } from 'app/entities/rss/rss.model';
import { RssService } from 'app/entities/rss/service/rss.service';

import { ClientUpdateComponent } from './client-update.component';

describe('Client Management Update Component', () => {
  let comp: ClientUpdateComponent;
  let fixture: ComponentFixture<ClientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientService: ClientService;
  let rssService: RssService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClientUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ClientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientService = TestBed.inject(ClientService);
    rssService = TestBed.inject(RssService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Rss query and add missing value', () => {
      const client: IClient = { id: 456 };
      const rsses: IRss[] = [{ id: 84689 }];
      client.rsses = rsses;

      const rssCollection: IRss[] = [{ id: 6081 }];
      jest.spyOn(rssService, 'query').mockReturnValue(of(new HttpResponse({ body: rssCollection })));
      const additionalRsses = [...rsses];
      const expectedCollection: IRss[] = [...additionalRsses, ...rssCollection];
      jest.spyOn(rssService, 'addRssToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(rssService.query).toHaveBeenCalled();
      expect(rssService.addRssToCollectionIfMissing).toHaveBeenCalledWith(rssCollection, ...additionalRsses);
      expect(comp.rssesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const client: IClient = { id: 456 };
      const rsses: IRss = { id: 63792 };
      client.rsses = [rsses];

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(client));
      expect(comp.rssesSharedCollection).toContain(rsses);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = { id: 123 };
      jest.spyOn(clientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: client }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientService.update).toHaveBeenCalledWith(client);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = new Client();
      jest.spyOn(clientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: client }));
      saveSubject.complete();

      // THEN
      expect(clientService.create).toHaveBeenCalledWith(client);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = { id: 123 };
      jest.spyOn(clientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientService.update).toHaveBeenCalledWith(client);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRssById', () => {
      it('Should return tracked Rss primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRssById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedRss', () => {
      it('Should return option if no Rss is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedRss(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Rss for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedRss(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Rss is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedRss(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
