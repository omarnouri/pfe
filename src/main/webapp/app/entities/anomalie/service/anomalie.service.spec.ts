import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnomalie, Anomalie } from '../anomalie.model';

import { AnomalieService } from './anomalie.service';

describe('Anomalie Service', () => {
  let service: AnomalieService;
  let httpMock: HttpTestingController;
  let elemDefault: IAnomalie;
  let expectedResult: IAnomalie | IAnomalie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AnomalieService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      msgAno: 'AAAAAAA',
      msgSol: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Anomalie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Anomalie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Anomalie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          msgAno: 'BBBBBB',
          msgSol: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Anomalie', () => {
      const patchObject = Object.assign(
        {
          msgAno: 'BBBBBB',
          msgSol: 'BBBBBB',
        },
        new Anomalie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Anomalie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          msgAno: 'BBBBBB',
          msgSol: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Anomalie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAnomalieToCollectionIfMissing', () => {
      it('should add a Anomalie to an empty array', () => {
        const anomalie: IAnomalie = { id: 123 };
        expectedResult = service.addAnomalieToCollectionIfMissing([], anomalie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anomalie);
      });

      it('should not add a Anomalie to an array that contains it', () => {
        const anomalie: IAnomalie = { id: 123 };
        const anomalieCollection: IAnomalie[] = [
          {
            ...anomalie,
          },
          { id: 456 },
        ];
        expectedResult = service.addAnomalieToCollectionIfMissing(anomalieCollection, anomalie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Anomalie to an array that doesn't contain it", () => {
        const anomalie: IAnomalie = { id: 123 };
        const anomalieCollection: IAnomalie[] = [{ id: 456 }];
        expectedResult = service.addAnomalieToCollectionIfMissing(anomalieCollection, anomalie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anomalie);
      });

      it('should add only unique Anomalie to an array', () => {
        const anomalieArray: IAnomalie[] = [{ id: 123 }, { id: 456 }, { id: 3151 }];
        const anomalieCollection: IAnomalie[] = [{ id: 123 }];
        expectedResult = service.addAnomalieToCollectionIfMissing(anomalieCollection, ...anomalieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const anomalie: IAnomalie = { id: 123 };
        const anomalie2: IAnomalie = { id: 456 };
        expectedResult = service.addAnomalieToCollectionIfMissing([], anomalie, anomalie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anomalie);
        expect(expectedResult).toContain(anomalie2);
      });

      it('should accept null and undefined values', () => {
        const anomalie: IAnomalie = { id: 123 };
        expectedResult = service.addAnomalieToCollectionIfMissing([], null, anomalie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anomalie);
      });

      it('should return initial array if no Anomalie is added', () => {
        const anomalieCollection: IAnomalie[] = [{ id: 123 }];
        expectedResult = service.addAnomalieToCollectionIfMissing(anomalieCollection, undefined, null);
        expect(expectedResult).toEqual(anomalieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
