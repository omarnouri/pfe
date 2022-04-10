import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChaine, Chaine } from '../chaine.model';
import { ChaineService } from '../service/chaine.service';

@Injectable({ providedIn: 'root' })
export class ChaineRoutingResolveService implements Resolve<IChaine> {
  constructor(protected service: ChaineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChaine> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chaine: HttpResponse<Chaine>) => {
          if (chaine.body) {
            return of(chaine.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chaine());
  }
}
