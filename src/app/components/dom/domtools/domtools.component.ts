/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, TemplateRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

// import * as moment from 'moment';
import { format } from 'date-fns'

import { DomSettingsComponent } from '../domsettings/domsettings.component';

@Component({
  selector: 'app-domtools',
  templateUrl: './domtools.component.html',
  styleUrls: ['./domtools.component.css'],
})
export class DomToolsComponent {
  bsModalRef!: BsModalRef;

  iCount = 0;
  selectedLabel = 'cdd* json | zip';

  zipBackup = new JSZip();
  zipInspect = new JSZip();

  file: any;
  files = [] as any;
  fileName = 'cdd* json | zip';
  fileNameLeft!: string;
  fileIsZip = false;
  fileIsJson = false;

  contentJson = null;

  fileNameArray = [] as any;
  fileNameLeftArray = []  as any;
  contentJsonArray = [] as any;

  selectedFile = 0;

  constructor(
    private modalService: BsModalService,
    private ts: TranslateService
  ) {}

  openModalSettings() {
    const lblTitle = this.ts.instant('CDDTOOLS.SettingsModalTitle');
    const lblCloseBtnName = this.ts.instant('CDDTOOLS.ModalCloseBtnName');

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(DomSettingsComponent, {
      initialState,
    });
    this.bsModalRef.content.onSaved.subscribe(() => {
      // nothing
    });
    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }

  fileChanged(e: any) {
    this.files = e.target.files;
    const countSelected: number = e.target.files.length;
    if (countSelected) {
      console.log(countSelected);
      // if zip file selected, check first only one allowed
      const checkfileType = e.target.files[0].name.split('.');
      if (checkfileType[1] === 'zip' && !(countSelected === 1)) {
        alert('Select only one zip file please!');
      } else {
        this.fileNameArray = [];
        this.iCount = 0;
        while (this.iCount < countSelected) {
          this.file = e.target.files[this.iCount];

          if (this.file) {
            const fileType = e.target.files[this.iCount].name.split('.');
            switch (fileType[0].substring(0, 3)) {
              case 'cdd':
                switch (fileType[1]) {
                  case 'zip':
                    this.fileIsZip = true;
                    this.fileIsJson = false;
                    this.fileName = this.file.name;
                    this.selectedLabel = this.file.name;
                    break;

                  case 'json':
                    this.fileIsZip = false;
                    this.fileIsJson = true;
                    this.fileName = this.file.name;
                    // this.fileNameLeft = fileType[0];
                    this.fileRead(this.fileName, fileType[0]);
                    this.selectedLabel = countSelected + ' json files selected';
                    break;

                  default:
                    this.onReset();
                }
                break;

              default:
                this.onReset();
            }
          } else {
            this.onReset();
          }
          this.iCount++;
        }
      }
      this.onChangeFileArray(0);
    } else {
      this.onReset();
    }
  }

  onReset() {
    this.contentJson = null;
    this.fileIsZip = false;
    this.fileIsJson = false;
    this.file =   null;
    this.fileName = 'cdd* json | zip';
    this.fileNameArray = [];
  }

  onChangeFileArray(target: any) {
    this.selectedFile = target.value;
    this.contentJson = this.contentJsonArray[target.value];
  }

  fileRead(jsonFileName: string, jsonFileLeft: any ) {
    const fr = new FileReader();
    fr.onload = () => {
      this.fileNameLeftArray.unshift(jsonFileLeft);
      this.contentJsonArray.unshift(JSON.parse('' + fr.result));
      this.fileNameArray.unshift(jsonFileName);
    };
    fr.readAsText(this.file );
  }

  questionYesNo(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  onStorageStore(choosen: boolean) {
    if (choosen) {
      // move data to
      // const fileType = e.target.files[this.iCount].name.split('.');
      // this.fileNameLeft = fileType[0];

      this.iCount = 0;
      while (this.iCount < this.fileNameArray.length) {
        localStorage.setItem(
          this.fileNameLeftArray[this.iCount],
          JSON.stringify(this.contentJsonArray[this.iCount])
        );
        this.iCount++;
      }
      this.onReset();
    }
    this.bsModalRef.hide();
  }

  onZipInspect(choosen: boolean) {
    if (choosen) {
      this.zipInspect
        .loadAsync(this.file)
        // tslint:disable-next-line: only-arrow-functions
        .then(function (zip) {
          // you now have every files containte in the loaded zip
          // tslint:disable-next-line: only-arrow-functions
          zip.forEach(function (
            relativePath: string,
            zipEntry: { name: string }
          ) {
            alert(zipEntry.name);
          });
        });
    }
    this.bsModalRef.hide();
  }

  onBackup(choosen: boolean) {
    if (choosen) {
      const toSearch = 'cdd';
      const lengthOfSearch = toSearch.length;
      for (let i = 0, len = localStorage.length; i < len; i++) {
        const key = localStorage.key(i) as string;
        if (key.substring(0, lengthOfSearch) === toSearch) {
          const value = localStorage[key];
          this.zipBackup.file(key + '.json', value);
        }
      }

      // const momentDate = moment().format('YYYYMMDD-hhmmss');
      const fnsDate = format(new Date(), 'yyyyMMdd-HHmmss');
      // console.log(momentDate);
      console.log(fnsDate);
      this.zipBackup
        .generateAsync({ type: 'blob' })
        // tslint:disable-next-line: only-arrow-functions
        .then(function (content: string | Blob) {
          saveAs(content, 'cddBackup_' + fnsDate + '.zip');
        });
    }
    this.bsModalRef.hide();
  }
}
