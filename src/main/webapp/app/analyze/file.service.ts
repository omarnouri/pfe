import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFile } from './file.model';
import { IAnomalie } from 'app/entities/anomalie/anomalie.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getfiles(req?: any): Observable<HttpResponse<IFile[]>> {
    const options = createRequestOption(req);
    return this.http.get<IFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  analyzer(fileName: string | undefined, chaineId: number): Observable<HttpResponse<IAnomalie[]>> {
    const options = createRequestOption({
      fileName,
      chaineId,
    });
    return this.http.get<IAnomalie[]>(`${this.resourceUrl}/analyze`, { params: options, observe: 'response' });
  }
}
