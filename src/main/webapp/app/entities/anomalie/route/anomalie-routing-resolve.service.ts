import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnomalie, Anomalie } from '../anomalie.model';
import { AnomalieService } from '../service/anomalie.service';

@Injectable({ providedIn: 'root' })
export class AnomalieRoutingResolveService implements Resolve<IAnomalie> {
  constructor(protected service: AnomalieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnomalie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((anomalie: HttpResponse<Anomalie>) => {
          if (anomalie.body) {
            return of(anomalie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Anomalie());
  }
}
