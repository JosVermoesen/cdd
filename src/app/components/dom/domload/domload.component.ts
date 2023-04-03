import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DomEntry } from './../../../models/domEntry';

@Component({
  selector: 'app-domload',
  templateUrl: './domload.component.html',
  styleUrls: ['./domload.component.css'],
})
export class DomLoadComponent implements OnInit {
  title!: string;
  closeBtnName!: string;
  locationReload = false;
  iCount!: number;

  domLoadForm!: FormGroup;
  domJson!: DomEntry[];

  localStorageItems = [] as string[];
  localStorageItemValues = [] as string[];

  public onSelected!: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.onChangeGroupType('cddClient_');
    this.onSelected = new Subject();
  }

  onChangeGroupType(groupTypeTarget: any) {
    const domToSearch = groupTypeTarget.value || 'choose';    
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

        // console.log(domToSearch + itemDescription + ' (key)' + ' => ' + value);
      } else {
        // skip
      }
    }
    this.localStorageItems.sort();
    this.domLoadForm = this.fb.group({
      groupType: [groupTypeTarget.value, Validators.required],
      name: [this.localStorageItems[0], Validators.required],
      replaceEntries: [false],
      deleteAfterLoading: [false],
    });
  }

  onSubmit() {
    if (this.domLoadForm.valid) {
      const areThereEntries = localStorage.getItem('cddEntries_Template');
      this.locationReload = true;
      const itemName =
        this.domLoadForm.value.groupType + this.domLoadForm.value.name;

      if (this.domLoadForm.value.replaceEntries) {
        localStorage.removeItem('cddEntries_Template');

        const itemVal = localStorage.getItem(itemName);
        if (itemVal) {
          this.domJson = JSON.parse(itemVal);
        }
        localStorage.setItem(
          'cddEntries_Template',
          JSON.stringify(this.domJson)
        );
      } else {
        if (areThereEntries) {
          const templateVal = localStorage.getItem('cddEntries_Template');
          if (templateVal) {
            this.domJson = JSON.parse(templateVal);
          }
        }

        const itemVal2 = localStorage.getItem(itemName);
        const tmpJson: DomEntry[] = JSON.parse(itemVal2 as string);

        if (areThereEntries === null) {
          this.domJson = tmpJson;
        } else {
          this.iCount = 0;
          while (this.iCount < tmpJson.length) {
            const tmpEntry: DomEntry = tmpJson[this.iCount];
            this.domJson.unshift(tmpEntry);
            this.iCount++;
          }
        }

        localStorage.setItem(
          'cddEntries_Template',
          JSON.stringify(this.domJson)
        );

        if (this.domLoadForm.value.deleteAfterLoading === true) {
          localStorage.removeItem(itemName);
        }
      }
      this.onSelected.next(true);
      this.bsModalRef.hide();
    }
  }
}
