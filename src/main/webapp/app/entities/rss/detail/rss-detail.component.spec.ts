import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RssDetailComponent } from './rss-detail.component';

describe('Rss Management Detail Component', () => {
  let comp: RssDetailComponent;
  let fixture: ComponentFixture<RssDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RssDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ rss: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RssDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RssDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load rss on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.rss).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
