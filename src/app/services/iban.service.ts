import { Injectable } from '@angular/core';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class IbanService {
  dPip!: number;
  dPip2!: number;
  calcPip!: number;
  inputIsSepa!: boolean;

  rekOld!: string;
  rekSepa!: string;

  constructor() {}

  check(anyRekString: string, _sepaFlag: boolean, _returnFormatted: boolean) {
    const rekLength = anyRekString.length;

    switch (rekLength) {
      case 12:
        this.inputIsSepa = false;
        this.rekOld = anyRekString;
        break;

      case 14:
        this.inputIsSepa = false;
        this.rekOld =
          anyRekString.substring(0, 3) +
          anyRekString.substring(4, 11) +
          anyRekString.substring(12);
        break;

      case 16:
        this.inputIsSepa = true;
        this.rekSepa = anyRekString;
        this.rekOld = this.rekSepa.substring(4);
        break;

      case 19:
        this.inputIsSepa = true;
        this.rekSepa =
          anyRekString.substring(0, 4) +
          anyRekString.substring(5, 9) +
          anyRekString.substring(10, 14) +
          anyRekString.substring(15);
        this.rekOld = this.rekSepa.substring(4);
        break;

      default:
        return 'invalid';
    }

    // first check if rekOld is valid
    this.dPip = Number(this.rekOld.substring(0, 10));
    this.dPip2 = Number(this.rekOld.substring(10));
    this.calcPip = this.dPip % 97;

    if (this.rekOld.substring(10, 2) === '00') {
      return 'invalid';
    } else if (this.calcPip === 0 && this.rekOld.substring(10, 2) === '97') {
      // ok
    } else if (this.calcPip === this.dPip2) {
      // ok
    } else {
      return 'invalid';
    }

    // if rekOld is valid, check if rekSepa is valid
    if (rekLength === 12 || rekLength === 14) {
      return 'valid';
    } else if (rekLength === 16 || rekLength === 19) {
      if (this.rekSepa.substring(0, 2) === 'NL') {
        // ok
      } else {
        return 'invalid';
      }
    }
    return 'invalid';
  }
}
