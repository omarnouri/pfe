import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChaineService } from '../service/chaine.service';

import { ChaineComponent } from './chaine.component';

describe('Chaine Management Component', () => {
  let comp: ChaineComponent;
  let fixture: ComponentFixture<ChaineComponent>;
  let service: ChaineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChaineComponent],
    })
      .overrideTemplate(ChaineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChaineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChaineService);

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
    expect(comp.chaines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
