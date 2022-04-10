import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChaine, Chaine } from '../chaine.model';

import { ChaineService } from './chaine.service';

describe('Chaine Service', () => {
  let service: ChaineService;
  let httpMock: HttpTestingController;
  let elemDefault: IChaine;
  let expectedResult: IChaine | IChaine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChaineService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
      process: 'AAAAAAA',
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

    it('should create a Chaine', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Chaine()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chaine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          process: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chaine', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
        },
        new Chaine()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chaine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          process: 'BBBBBB',
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

    it('should delete a Chaine', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChaineToCollectionIfMissing', () => {
      it('should add a Chaine to an empty array', () => {
        const chaine: IChaine = { id: 123 };
        expectedResult = service.addChaineToCollectionIfMissing([], chaine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chaine);
      });

      it('should not add a Chaine to an array that contains it', () => {
        const chaine: IChaine = { id: 123 };
        const chaineCollection: IChaine[] = [
          {
            ...chaine,
          },
          { id: 456 },
        ];
        expectedResult = service.addChaineToCollectionIfMissing(chaineCollection, chaine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chaine to an array that doesn't contain it", () => {
        const chaine: IChaine = { id: 123 };
        const chaineCollection: IChaine[] = [{ id: 456 }];
        expectedResult = service.addChaineToCollectionIfMissing(chaineCollection, chaine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chaine);
      });

      it('should add only unique Chaine to an array', () => {
        const chaineArray: IChaine[] = [{ id: 123 }, { id: 456 }, { id: 68742 }];
        const chaineCollection: IChaine[] = [{ id: 123 }];
        expectedResult = service.addChaineToCollectionIfMissing(chaineCollection, ...chaineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chaine: IChaine = { id: 123 };
        const chaine2: IChaine = { id: 456 };
        expectedResult = service.addChaineToCollectionIfMissing([], chaine, chaine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chaine);
        expect(expectedResult).toContain(chaine2);
      });

      it('should accept null and undefined values', () => {
        const chaine: IChaine = { id: 123 };
        expectedResult = service.addChaineToCollectionIfMissing([], null, chaine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chaine);
      });

      it('should return initial array if no Chaine is added', () => {
        const chaineCollection: IChaine[] = [{ id: 123 }];
        expectedResult = service.addChaineToCollectionIfMissing(chaineCollection, undefined, null);
        expect(expectedResult).toEqual(chaineCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
