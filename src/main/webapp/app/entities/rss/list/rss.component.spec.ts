import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RssService } from '../service/rss.service';

import { RssComponent } from './rss.component';

describe('Rss Management Component', () => {
  let comp: RssComponent;
  let fixture: ComponentFixture<RssComponent>;
  let service: RssService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RssComponent],
    })
      .overrideTemplate(RssComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RssComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RssService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.rsses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
