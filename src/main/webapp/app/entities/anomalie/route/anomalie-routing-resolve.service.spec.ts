jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAnomalie, Anomalie } from '../anomalie.model';
import { AnomalieService } from '../service/anomalie.service';

import { AnomalieRoutingResolveService } from './anomalie-routing-resolve.service';

describe('Anomalie routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AnomalieRoutingResolveService;
  let service: AnomalieService;
  let resultAnomalie: IAnomalie | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(AnomalieRoutingResolveService);
    service = TestBed.inject(AnomalieService);
    resultAnomalie = undefined;
  });

  describe('resolve', () => {
    it('should return IAnomalie returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnomalie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAnomalie).toEqual({ id: 123 });
    });

    it('should return new IAnomalie if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnomalie = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAnomalie).toEqual(new Anomalie());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Anomalie })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnomalie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAnomalie).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
