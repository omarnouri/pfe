import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRss, Rss } from '../rss.model';

import { RssService } from './rss.service';

describe('Rss Service', () => {
  let service: RssService;
  let httpMock: HttpTestingController;
  let elemDefault: IRss;
  let expectedResult: IRss | IRss[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RssService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      titre: 'AAAAAAA',
      url: 'AAAAAAA',
      estActive: false,
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

    it('should create a Rss', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Rss()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Rss', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          url: 'BBBBBB',
          estActive: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Rss', () => {
      const patchObject = Object.assign(
        {
          titre: 'BBBBBB',
          url: 'BBBBBB',
        },
        new Rss()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Rss', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          url: 'BBBBBB',
          estActive: true,
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

    it('should delete a Rss', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRssToCollectionIfMissing', () => {
      it('should add a Rss to an empty array', () => {
        const rss: IRss = { id: 123 };
        expectedResult = service.addRssToCollectionIfMissing([], rss);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rss);
      });

      it('should not add a Rss to an array that contains it', () => {
        const rss: IRss = { id: 123 };
        const rssCollection: IRss[] = [
          {
            ...rss,
          },
          { id: 456 },
        ];
        expectedResult = service.addRssToCollectionIfMissing(rssCollection, rss);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Rss to an array that doesn't contain it", () => {
        const rss: IRss = { id: 123 };
        const rssCollection: IRss[] = [{ id: 456 }];
        expectedResult = service.addRssToCollectionIfMissing(rssCollection, rss);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rss);
      });

      it('should add only unique Rss to an array', () => {
        const rssArray: IRss[] = [{ id: 123 }, { id: 456 }, { id: 65528 }];
        const rssCollection: IRss[] = [{ id: 123 }];
        expectedResult = service.addRssToCollectionIfMissing(rssCollection, ...rssArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rss: IRss = { id: 123 };
        const rss2: IRss = { id: 456 };
        expectedResult = service.addRssToCollectionIfMissing([], rss, rss2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rss);
        expect(expectedResult).toContain(rss2);
      });

      it('should accept null and undefined values', () => {
        const rss: IRss = { id: 123 };
        expectedResult = service.addRssToCollectionIfMissing([], null, rss, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rss);
      });

      it('should return initial array if no Rss is added', () => {
        const rssCollection: IRss[] = [{ id: 123 }];
        expectedResult = service.addRssToCollectionIfMissing(rssCollection, undefined, null);
        expect(expectedResult).toEqual(rssCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
