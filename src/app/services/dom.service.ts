import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { DomEntry } from '../models/domEntry';

@Injectable()
export class DomService {
  domEntries: DomEntry[];

  private domEntrieSource = new BehaviorSubject<DomEntry>({
    id: '',
    endToEndReference: '',
    amount: 0,
    mandateId: '',
    mandateStartDate: null,
    clientName: '',
    clientIban: '',
    communication: '',
  });

  selectedDomEntry = this.domEntrieSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  constructor() {
    this.domEntries = [];
  }

  getDomEntries(): Observable<DomEntry[]> {
    const cddEntriesTemplate = localStorage.getItem('cddEntries_Template');
    if (!cddEntriesTemplate) {
      this.domEntries = [];
    } else {
      this.domEntries = JSON.parse(cddEntriesTemplate);
    }

    return of(
      this.domEntries.sort((a: any, b: any) => {
        return (b.dummy = a.dummy);
      })
    );
  }

  setFormDomEntry(domEntry: DomEntry) {
    this.domEntrieSource.next(domEntry);
  }

  addDomEntry(domEntry: DomEntry) {
    this.domEntries.unshift(domEntry);

    // Add to local storage
    localStorage.setItem(
      'cddEntries_Template',
      JSON.stringify(this.domEntries)
    );
  }

  updateDomEntry(domEntry: DomEntry) {
    this.domEntries.forEach((cur, index) => {
      if (domEntry.id === cur.id) {
        this.domEntries.splice(index, 1);
      }
    });
    this.domEntries.unshift(domEntry);

    // Update local storage
    localStorage.setItem(
      'cddEntries_Template',
      JSON.stringify(this.domEntries)
    );
  }

  deleteDomEntry(domEntry: DomEntry) {
    this.domEntries.forEach((cur, index) => {
      if (domEntry.id === cur.id) {
        this.domEntries.splice(index, 1);
      }
    });

    // Delete from local storage
    localStorage.setItem(
      'cddEntries_Template',
      JSON.stringify(this.domEntries)
    );
  }

  deleteAllDomEntries() {
    // Delete from local storage
    localStorage.removeItem('cddEntries_Template');
    this.clearState();
  }

  clearState() {
    this.stateSource.next(true);
  }
}
