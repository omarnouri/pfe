import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnomalie, getAnomalieIdentifier } from '../anomalie.model';

export type EntityResponseType = HttpResponse<IAnomalie>;
export type EntityArrayResponseType = HttpResponse<IAnomalie[]>;

@Injectable({ providedIn: 'root' })
export class AnomalieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/anomalies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(anomalie: IAnomalie): Observable<EntityResponseType> {
    return this.http.post<IAnomalie>(this.resourceUrl, anomalie, { observe: 'response' });
  }

  update(anomalie: IAnomalie): Observable<EntityResponseType> {
    return this.http.put<IAnomalie>(`${this.resourceUrl}/${getAnomalieIdentifier(anomalie) as number}`, anomalie, { observe: 'response' });
  }

  partialUpdate(anomalie: IAnomalie): Observable<EntityResponseType> {
    return this.http.patch<IAnomalie>(`${this.resourceUrl}/${getAnomalieIdentifier(anomalie) as number}`, anomalie, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnomalie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnomalie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnomalieToCollectionIfMissing(anomalieCollection: IAnomalie[], ...anomaliesToCheck: (IAnomalie | null | undefined)[]): IAnomalie[] {
    const anomalies: IAnomalie[] = anomaliesToCheck.filter(isPresent);
    if (anomalies.length > 0) {
      const anomalieCollectionIdentifiers = anomalieCollection.map(anomalieItem => getAnomalieIdentifier(anomalieItem)!);
      const anomaliesToAdd = anomalies.filter(anomalieItem => {
        const anomalieIdentifier = getAnomalieIdentifier(anomalieItem);
        if (anomalieIdentifier == null || anomalieCollectionIdentifiers.includes(anomalieIdentifier)) {
          return false;
        }
        anomalieCollectionIdentifiers.push(anomalieIdentifier);
        return true;
      });
      return [...anomaliesToAdd, ...anomalieCollection];
    }
    return anomalieCollection;
  }
}
