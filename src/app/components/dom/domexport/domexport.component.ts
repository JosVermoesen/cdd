/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { saveAs } from 'file-saver';

// import * as moment from 'moment';
import { format, formatISO } from 'date-fns';

import { DomEntry } from '../../../models/domEntry';
import { DomCompany } from './../../../models/domCompany';

@Component({
  selector: 'app-domexport',
  templateUrl: './domexport.component.html',
  styleUrls: ['./domexport.component.css'],
})
export class DomExportComponent implements OnInit {
  title!: string;
  closeBtnName!: string;

  templateDom: any;
  templateClient: any;
  templateEachClient: any;
  templateClients = '';

  domExportForm!: FormGroup;

  iCount!: number;
  cCount!: number;
  domCount!: number;
  position!: number;

  // from json localStore
  domData!: DomCompany;
  domEntries!: DomEntry[];

  // arrays of fields
  settingFields!: string[];
  varFields!: string[];
  entryFields!: string[];

  // arrays of data
  domSettingsData!: string[];
  domVarData!: string[];
  domEntryData!: string[];

  public onSelected!: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.onSelected = new Subject();

    this.http
      .get('../../../assets/xmltemplates/dom-drctdbttxinf.xml', {
        responseType: 'text' as 'json',
      })
      .subscribe((data) => {
        this.templateClient = data;
      });
    this.http
      .get('../../../assets/xmltemplates/dom-document.xml', {
        responseType: 'text' as 'json',
      })
      .subscribe((data) => {
        this.templateDom = data;
      });

    this.settingFields = [
      'companyName', // ZAKENKANTOOR H. ROELANDT EN J. VERMOESEN
      'companyNumber', // 0440058217
      'companyCountry', // BE
      'companyStreet', // GROTE BAAN 141
      'companyPCPlace', // 9310 HERDERSEM
      'companyIban', // BE83891854037015
      'companyBic', // VDSPBE91
      'companyDomId', // BE02ZZZ0440058217
    ];

    this.varFields = [
      'domDescription', // VsoftTool-3.10-all-OK
      'domDateCreated', // 2019-05-07T08:35:04
      'domInfoText', // Verzekeringen 2019 5 van 12
      'domMemoDate', // 2019-05-09
    ];

    this.entryFields = [
      'endToEndReference', // MEI 2019 VERZ
      'amount', // 372.48
      'mandateId', // VAN BELLE BUYSSE
      'mandateStartDate', // 2014-07-28
      'clientName', // VAN BELLE - BUYSSE
      'clientIban', // BE51001831288662
      'communication', // MEI 2019 VERZ
    ];
    this.clearState();
  }

  clearState() {
    // const momentDate = moment().format();
    const fnsDate = formatISO(new Date()); // format(new Date(), 'yyyy-MM-dd');
    // console.log('momentDate: ' + momentDate);
    console.log('fnDate: ' + fnsDate);

    this.domExportForm = this.fb.group({
      domDescription: ['CDD', Validators.required],
      // domDateCreated: [momentDate, Validators.required],
      domDateCreated: [fnsDate, Validators.required],
      domInfoText: [null, Validators.required],
      domMemoDate: [null, Validators.required],
      clearEntriesAfterLoading: [false],
    });
  }

  generateDomXml() {
    const memoDate = this.domExportForm.value.domMemoDate;
    // const momentMemoDate = moment(memoDate).format('YYYY-MM-DD');
    // const memoFnsDate = this.domExportForm.value.domMemoDate;
    const fnsMemoDate = format(new Date(memoDate), 'yyyy-MM-dd');
    // console.log(momentMemoDate);
    console.log(fnsMemoDate);

    // this.domExportForm.value.domMemoDate = momentMemoDate;
    this.domExportForm.value.domMemoDate = fnsMemoDate;

    if (this.domExportForm.valid) {
      this.domVarData = [
        this.domExportForm.value.domDescription,
        this.domExportForm.value.domDateCreated,
        this.domExportForm.value.domInfoText,
        this.domExportForm.value.domMemoDate,
      ];

      const templateVal = localStorage.getItem('cddSettings_Template');
      if (templateVal) {
        this.domData = JSON.parse(templateVal);
      }

      this.domSettingsData = [
        this.domData.name,
        this.domData.enterpriseNumber,
        this.domData.country,
        this.domData.street,
        this.domData.pcPlace,
        this.domData.iban,
        this.domData.bic,
        this.domData.domId,
      ];

      const templateVal2 = localStorage.getItem('cddEntries_Template');
      if (templateVal2) {
        this.domEntries = JSON.parse(templateVal2);
      }

      if (this.domEntries == null) {
        this.domCount = 0;
      } else {
        this.domCount = this.domEntries.length;
      }

      // insert domsettings data
      this.iCount = 0;
      while (this.iCount < this.settingFields.length) {
        const fieldToSearch = '{' + this.settingFields[this.iCount] + '}';
        this.position = this.templateDom.indexOf(fieldToSearch);
        while (this.position > 0) {
          this.templateDom = this.templateDom.replace(
            fieldToSearch,
            this.domSettingsData[this.iCount]
          );
          this.position = this.templateDom.indexOf(fieldToSearch);
        }
        this.iCount++;
      }

      // insert variable data
      this.iCount = 0;
      while (this.iCount < this.varFields.length) {
        const fieldToSearch = '{' + this.varFields[this.iCount] + '}';
        this.position = this.templateDom.indexOf(fieldToSearch);
        while (this.position > 0) {
          this.templateDom = this.templateDom.replace(
            fieldToSearch,
            this.domVarData[this.iCount]
          );
          this.position = this.templateDom.indexOf(fieldToSearch);
        }
        this.iCount++;
      }

      // insert count
      const fieldCountSearch = '{domCount}';
      this.position = this.templateDom.indexOf(fieldCountSearch);
      while (this.position > 0) {
        this.templateDom = this.templateDom.replace(
          fieldCountSearch,
          this.domCount.toString()
        );
        this.position = this.templateDom.indexOf(fieldCountSearch);
      }

      // insert entry data
      this.cCount = 0;
      while (this.cCount < this.domEntries.length) {
        this.domEntryData = [
          this.domEntries[this.cCount].endToEndReference,
          this.domEntries[this.cCount].amount + '',
          this.domEntries[this.cCount].mandateId,
          this.domEntries[this.cCount].mandateStartDate,
          this.domEntries[this.cCount].clientName,
          this.domEntries[this.cCount].clientIban,
          this.domEntries[this.cCount].communication,
        ];

        this.iCount = 0;
        this.templateEachClient = this.templateClient;
        while (this.iCount < this.entryFields.length) {
          const fieldToSearch = '{' + this.entryFields[this.iCount] + '}';
          this.position = this.templateEachClient.indexOf(fieldToSearch);
          while (this.position > 0) {
            this.templateEachClient = this.templateEachClient.replace(
              fieldToSearch,
              this.domEntryData[this.iCount]
            );
            this.position = this.templateDom.indexOf(fieldToSearch);
          }
          this.iCount++;
        }
        this.cCount++;
        this.templateClients = this.templateClients + this.templateEachClient;
      }
      const stringToReplace = '<Vsoft>{drctdbttxinf}</Vsoft>';
      this.templateDom = this.templateDom.replace(
        stringToReplace,
        this.templateClients
      );

      const blob = new Blob([this.templateDom], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(
        blob,
        this.domExportForm.value.domDescription +
          '-memo_' +
          this.domExportForm.value.domMemoDate +
          '.xml'
      );
      // Save a log
      // const momentDate = moment().format('YYYYMMDD-hhmmss');
      const fnsDate = format(new Date(), 'yyyyMMdd-HHmmss');
      // console.log(momentDate);
      console.log(fnsDate);

      localStorage.setItem(
        'cddLogXML_' + fnsDate,
        JSON.stringify(this.domEntries)
      );

      if (this.domExportForm.value.clearEntriesAfterLoading === true) {
        localStorage.removeItem('cddEntries_Template');
      }
      this.onSelected.next(true);
      this.bsModalRef.hide();
    }
  }
}
