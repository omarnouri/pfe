import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChaineDetailComponent } from './chaine-detail.component';

describe('Chaine Management Detail Component', () => {
  let comp: ChaineDetailComponent;
  let fixture: ComponentFixture<ChaineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChaineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chaine: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChaineDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChaineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chaine on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chaine).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
