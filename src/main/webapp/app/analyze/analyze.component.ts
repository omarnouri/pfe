import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { FileService } from './file.service';
import { IFile } from './file.model';
import { HttpResponse } from '@angular/common/http';
import { IChaine } from 'app/entities/chaine/chaine.model';
import { ChaineService } from 'app/entities/chaine/service/chaine.service';
import { IAnomalie } from 'app/entities/anomalie/anomalie.model';
import { AccountService } from 'app/core/auth/account.service';
import { takeUntil } from 'rxjs/operators';
import { IClient } from 'app/entities/client/client.model';

/* eslint-disable */
declare const Swal: any;

@Component({
  selector: 'sopra-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss'],
})
export class AnalyzeComponent implements OnInit, OnDestroy {
  isLoading?: boolean;
  chaines: IChaine[] = [];
  allFiles: IFile[] = [];
  filtredFiles: IFile[] = [];
  selectedChaine?: string;
  startDate?: string;
  endDate?: string;
  client?: IClient;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private fileService: FileService, private chaineService: ChaineService) {}

  loadAllChaine(): void {
    this.isLoading = true;

    this.chaineService.query().subscribe(
      (res: HttpResponse<IChaine[]>) => {
        this.isLoading = false;
        this.chaines = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        const client = account?.client;
        this.client = (client as IClient) || undefined;
        this.loadAllChaine();
        this.fileService.getfilesByPath({ path: client?.pathLogs }).subscribe((response: HttpResponse<IFile[]>) => {
          this.allFiles = response.body ?? [];
          this.filtredFiles = response.body ?? [];
          console.log(response);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  propertiesChanged(): void {
    let fff = this.allFiles;
    if (this.selectedChaine && this.selectedChaine !== '') {
      fff = this.allFiles.filter((a: IFile) => String(this.getType(a.type)).toLowerCase() === String(this.selectedChaine).toLowerCase());
    }
    if (this.endDate && this.endDate !== '' && this.startDate && this.startDate !== '') {
      fff = this.allFiles.filter(
        (a: IFile) =>
          this.startDate &&
          this.endDate &&
          a.updateDate >= new Date(this.startDate).getTime() &&
          a?.updateDate <= new Date(this.endDate)?.getTime()
      );
    } else if (this.startDate && this.startDate !== '') {
      fff = this.allFiles.filter((a: IFile) => this.startDate && a?.updateDate >= new Date(this.startDate).getTime());
    } else if (this.endDate && this.endDate !== '') {
      fff = this.allFiles.filter((a: IFile) => this.endDate && a?.updateDate <= new Date(this.endDate)?.getTime());
    }
    this.filtredFiles = fff;
  }

  getType(fileName?: string): string {
    try {
      if (!fileName) {
        throw new Error();
      }
      const type = fileName.split('.')[0];
      return type.substr(-3);
    } catch (error) {
      return '';
    }
  }
  bytesToSize(bytes?: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0 || !bytes) {
      return '0 Byte';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  }
  getChaineId(chaine: string): number {
    return this.chaines.find((el: IChaine) => el.libelle === chaine)?.id ?? 0;
  }
  analyser(file: IFile): void {
    this.fileService.analyzer(this.client?.pathLogs, file?.name, this.getChaineId(this.getType(file.name))).subscribe(
      (response: HttpResponse<IAnomalie[]>) => {
        console.log(response);
        if (response.body?.length === 0) {
          Swal.fire({
            icon: 'success',
            title: 'Valide',
            text: 'Aucune anomalie detecté',
          });
        } else {
          let html = '';
          let index = 1;
          response.body?.forEach((anomalie: IAnomalie) => {
            html += `<b class="info">${index}</b>: `;
            html += `<b>${anomalie.msgSol}</b><br>`;
            index++;
          });
          Swal.fire({
            icon: 'error',
            html: html,
          });
        }
        this.isLoading = false;
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Probléme au serveur...',
          text: `${error.statusText} !`,
          footer: `<a href="${error.url}">Why do I have this issue?</a>`,
        });
        this.isLoading = false;
      }
    );
    this.isLoading = true;
  }
}
