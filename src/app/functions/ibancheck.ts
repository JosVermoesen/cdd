export function IbanCheck(
  anyRekString: string,
  sepaFlag: boolean,
  returnFormatted: boolean
) {
  const rekLength = anyRekString.length;
  let dPip: number;
  let dPip2: number;
  let calcPip: number;
  let inputIsSepa: boolean;

  let rekOld: string;
  let rekSepa='';

  switch (rekLength) {
    case 12:
      inputIsSepa = false;
      rekOld = anyRekString;
      break;

    case 14:
      inputIsSepa = false;
      rekOld =
        anyRekString.substring(0, 3) +
        anyRekString.substring(4, 11) +
        anyRekString.substring(12);
      break;

    case 16:
      inputIsSepa = true;
      rekSepa = anyRekString;
      rekOld = rekSepa.substring(4);
      break;

    case 19:
      inputIsSepa = true;
      rekSepa =
        anyRekString.substring(0, 4) +
        anyRekString.substring(5, 9) +
        anyRekString.substring(10, 14) +
        anyRekString.substring(15);
      rekOld = rekSepa.substring(4);
      break;

    default:
      return 'invalid';
  }

  // first check if rekOld is valid
  dPip = Number(rekOld.substring(0, 10));
  dPip2 = Number(rekOld.substring(10));
  calcPip = dPip % 97;

  if (rekOld.substring(10, 2) === '00') {
    return 'invalid';
  } else if (calcPip === 0 && rekOld.substring(10, 2) === '97') {
    // ok
  } else if (calcPip === dPip2) {
    // ok
  } else {
    return 'invalid';
  }

  // then check if sepa version is needed
  if (!sepaFlag) {
    if (!returnFormatted) {
      return rekOld;
    } else {
      rekOld =
        rekOld.substring(0, 3) +
        ' ' +
        rekOld.substring(3, 10) +
        ' ' +
        rekOld.substring(10);
      return rekOld;
    }
  } else {
    if (!inputIsSepa) {
      rekSepa = 'BE00' + rekOld ;
    } else if (!(rekSepa.substring(0, 2) === 'BE')) {
      return 'invalid';
    }

    dPip = Number(rekOld.substring(10) + rekOld.substring(10) + '111400');
    calcPip = dPip % 97;

    if (!inputIsSepa && sepaFlag) {
      rekSepa = rekSepa.replace('BE00', 'BE' + FormatDummy(98 - calcPip, 2));
    }

    dPip2 = Number(rekSepa.substring(2, 4));
    if (!(98 - calcPip === dPip2)) {
      return 'invalid';
    }

    if (!returnFormatted) {
      return rekSepa;
    } else {
      rekSepa =
        rekSepa.substring(0, 4) +
        ' ' +
        rekSepa.substring(4, 8) +
        ' ' +
        rekSepa.substring(8, 12) +
        ' ' +
        rekSepa.substring(12);
      return rekSepa;
    }
  }
}

function FormatDummy(num: number, size: number) {
  const s = '000000000' + num;
  return s.substr(s.length - size);
}

