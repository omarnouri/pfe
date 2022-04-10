jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChaine, Chaine } from '../chaine.model';
import { ChaineService } from '../service/chaine.service';

import { ChaineRoutingResolveService } from './chaine-routing-resolve.service';

describe('Chaine routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChaineRoutingResolveService;
  let service: ChaineService;
  let resultChaine: IChaine | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ChaineRoutingResolveService);
    service = TestBed.inject(ChaineService);
    resultChaine = undefined;
  });

  describe('resolve', () => {
    it('should return IChaine returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChaine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChaine).toEqual({ id: 123 });
    });

    it('should return new IChaine if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChaine = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChaine).toEqual(new Chaine());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Chaine })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChaine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChaine).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
