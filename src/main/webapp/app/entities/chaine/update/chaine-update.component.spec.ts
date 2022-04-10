jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChaineService } from '../service/chaine.service';
import { IChaine, Chaine } from '../chaine.model';

import { ChaineUpdateComponent } from './chaine-update.component';

describe('Chaine Management Update Component', () => {
  let comp: ChaineUpdateComponent;
  let fixture: ComponentFixture<ChaineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chaineService: ChaineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChaineUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChaineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChaineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chaineService = TestBed.inject(ChaineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chaine: IChaine = { id: 456 };

      activatedRoute.data = of({ chaine });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chaine));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chaine>>();
      const chaine = { id: 123 };
      jest.spyOn(chaineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chaine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chaine }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chaineService.update).toHaveBeenCalledWith(chaine);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chaine>>();
      const chaine = new Chaine();
      jest.spyOn(chaineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chaine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chaine }));
      saveSubject.complete();

      // THEN
      expect(chaineService.create).toHaveBeenCalledWith(chaine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chaine>>();
      const chaine = { id: 123 };
      jest.spyOn(chaineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chaine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chaineService.update).toHaveBeenCalledWith(chaine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
