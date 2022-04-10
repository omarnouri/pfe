import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnomalieDetailComponent } from './anomalie-detail.component';

describe('Anomalie Management Detail Component', () => {
  let comp: AnomalieDetailComponent;
  let fixture: ComponentFixture<AnomalieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnomalieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ anomalie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AnomalieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AnomalieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load anomalie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.anomalie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
