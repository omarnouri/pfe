jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnomalieService } from '../service/anomalie.service';
import { IAnomalie, Anomalie } from '../anomalie.model';
import { IChaine } from 'app/entities/chaine/chaine.model';
import { ChaineService } from 'app/entities/chaine/service/chaine.service';

import { AnomalieUpdateComponent } from './anomalie-update.component';

describe('Anomalie Management Update Component', () => {
  let comp: AnomalieUpdateComponent;
  let fixture: ComponentFixture<AnomalieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let anomalieService: AnomalieService;
  let chaineService: ChaineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AnomalieUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AnomalieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnomalieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    anomalieService = TestBed.inject(AnomalieService);
    chaineService = TestBed.inject(ChaineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chaine query and add missing value', () => {
      const anomalie: IAnomalie = { id: 456 };
      const chaine: IChaine = { id: 89177 };
      anomalie.chaine = chaine;

      const chaineCollection: IChaine[] = [{ id: 26266 }];
      jest.spyOn(chaineService, 'query').mockReturnValue(of(new HttpResponse({ body: chaineCollection })));
      const additionalChaines = [chaine];
      const expectedCollection: IChaine[] = [...additionalChaines, ...chaineCollection];
      jest.spyOn(chaineService, 'addChaineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ anomalie });
      comp.ngOnInit();

      expect(chaineService.query).toHaveBeenCalled();
      expect(chaineService.addChaineToCollectionIfMissing).toHaveBeenCalledWith(chaineCollection, ...additionalChaines);
      expect(comp.chainesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const anomalie: IAnomalie = { id: 456 };
      const chaine: IChaine = { id: 68281 };
      anomalie.chaine = chaine;

      activatedRoute.data = of({ anomalie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(anomalie));
      expect(comp.chainesSharedCollection).toContain(chaine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anomalie>>();
      const anomalie = { id: 123 };
      jest.spyOn(anomalieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anomalie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anomalie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(anomalieService.update).toHaveBeenCalledWith(anomalie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anomalie>>();
      const anomalie = new Anomalie();
      jest.spyOn(anomalieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anomalie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anomalie }));
      saveSubject.complete();

      // THEN
      expect(anomalieService.create).toHaveBeenCalledWith(anomalie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anomalie>>();
      const anomalie = { id: 123 };
      jest.spyOn(anomalieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anomalie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(anomalieService.update).toHaveBeenCalledWith(anomalie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChaineById', () => {
      it('Should return tracked Chaine primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChaineById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
