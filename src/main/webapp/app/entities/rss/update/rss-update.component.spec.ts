jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RssService } from '../service/rss.service';
import { IRss, Rss } from '../rss.model';

import { RssUpdateComponent } from './rss-update.component';

describe('Rss Management Update Component', () => {
  let comp: RssUpdateComponent;
  let fixture: ComponentFixture<RssUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rssService: RssService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RssUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RssUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RssUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rssService = TestBed.inject(RssService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const rss: IRss = { id: 456 };

      activatedRoute.data = of({ rss });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(rss));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Rss>>();
      const rss = { id: 123 };
      jest.spyOn(rssService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rss });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rss }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(rssService.update).toHaveBeenCalledWith(rss);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Rss>>();
      const rss = new Rss();
      jest.spyOn(rssService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rss });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rss }));
      saveSubject.complete();

      // THEN
      expect(rssService.create).toHaveBeenCalledWith(rss);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Rss>>();
      const rss = { id: 123 };
      jest.spyOn(rssService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rss });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rssService.update).toHaveBeenCalledWith(rss);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
