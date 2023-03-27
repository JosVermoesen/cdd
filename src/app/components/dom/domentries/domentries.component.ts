/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { DomService } from '../../../services/dom.service';
import { DomEntry } from '../../../models/domEntry';
import { DomSaveComponent } from './../domsave/domsave.component';
import { DomLoadComponent } from '../domload/domload.component';
import { DomExportComponent } from './../domexport/domexport.component';

@Component({
  selector: 'app-domentries',
  templateUrl: './domentries.component.html',
  styleUrls: ['./domentries.component.css'],
})
export class DomEntriesComponent implements OnInit {
  bsModalRef!: BsModalRef;

  domEntries!: DomEntry[];
  selectedDomEntry!: DomEntry;

  localStorageItems!: string[];
  localStorageItemValues!: any[];

  loaded = false;
  entryCount!: number;

  constructor(
    private domService: DomService,
    private modalService: BsModalService,
    private ts: TranslateService
  ) {}

  ngOnInit() {
    this.domService.stateClear.subscribe((clear) => {
      if (clear) {
        this.selectedDomEntry = {
          id: '',
          endToEndReference: '',
          amount: 0,
          mandateId: '',
          mandateStartDate: '',
          clientName: '',
          clientIban: '',
          communication: '',
        };
      }
    });
    this.loadEntriesData();
  }

  loadEntriesData() {
    this.domService.getDomEntries().subscribe((result: DomEntry[]) => {
      this.domEntries = result;
      this.loaded = true;

      if (this.domEntries.length === 0) {
        this.entryCount = 0;
      } else {
        this.entryCount = this.domEntries.length;
      }
    });
  }

  entriesModalSave() {
    const lblTitle = this.ts.instant('CDDENTRIES.SaveModalTitle');
    const lblCloseBtnName = this.ts.instant('CDDENTRIES.ModalCloseBtnName');

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(DomSaveComponent, {
      initialState,
    });
    this.bsModalRef.content.onSaved.subscribe(() => {
      this.loadEntriesData();
    });
    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }

  entriesModalLoad() {
    console.log('entriesModalLoad');
    const lblTitle = this.ts.instant('CDDENTRIES.LoadModalTitle');
    const lblCloseBtnName = this.ts.instant('CDDENTRIES.ModalCloseBtnName');

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(DomLoadComponent, {
      initialState,
    });
    this.bsModalRef.content.onSelected.subscribe(() => {
      this.loadEntriesData();
    });
    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }

  openModalExport() {
    console.log('openModalExport');
    const lblTitle = this.ts.instant('CDDENTRIES.ExportModalTitle');
    const lblCloseBtnName = this.ts.instant('CDDENTRIES.ModalCloseBtnName');

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(DomExportComponent, {
      initialState,
    });
    this.bsModalRef.content.onSelected.subscribe(() => {
      this.loadEntriesData();
    });
    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }

  onSelect(domEntry: DomEntry) {
    this.loadEntriesData();
    this.domService.setFormDomEntry(domEntry);
    this.selectedDomEntry = domEntry;
  }

  deleteThisModal(template: TemplateRef<any>, domEntry: DomEntry) {
    this.selectedDomEntry = domEntry;
    this.bsModalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteThis(): void {
    this.domService.deleteDomEntry(this.selectedDomEntry);
    this.loadEntriesData();
    this.bsModalRef.hide();
  }

  declineDeleteThis(): void {
    this.bsModalRef.hide();
  }

  deleteAllModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteAll(): void {
    this.domService.deleteAllDomEntries();
    this.loadEntriesData();
    this.bsModalRef.hide();
  }

  declineDeleteAll(): void {
    this.bsModalRef.hide();
  }

  testing() {
    // all data in localStorage
    // const data = Object.assign({}, localStorage);
    // console.log(data);

    // list of all keys
    // Object.keys(localStorage).forEach(key => console.log(key));

    // try a list for keys and values
    // example: ignore 'token' and 'user' items

    /* this.localStorageItems = [];
    this.localStorageItemValues = [];
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i);
      if (key === 'token' || key === 'user') {
        // skip
      } else {
        const value = localStorage[key];
        this.localStorageItems.push(key);
        this.localStorageItemValues.push(value);

        console.log(key + ' => ' + value);
      }
    } */

    const domToSearch = 'cddClient_';
    const lengthOfSearch = domToSearch.length;
    this.localStorageItems = [];
    this.localStorageItemValues = [];
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i) as string;
      if (key.substring(0, lengthOfSearch) === domToSearch) {
        const value = localStorage[key];
        const itemDescription = key.substring(lengthOfSearch);
        this.localStorageItems.push(itemDescription);
        this.localStorageItemValues.push(value);
      }
    }
  }
}
