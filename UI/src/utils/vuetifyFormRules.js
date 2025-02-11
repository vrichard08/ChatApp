import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameMinute from 'date-fns/isSameMinute';
import startOfDay from 'date-fns/startOfDay';
import sub from 'date-fns/sub';

export function vRequired(msg) {
  return (v) => {
    if (v === 0) {
      return true;
    }
    return (
      (Array.isArray(v) && v.length == 0) ||
      v === true ||
      !!v ||
      msg ||
      'Kötelező mező'
    );
  };
}
export function vRequiredBool(msg) {
  return (v) => {
    return v === false || v === true || msg || 'Kötelező mező';
  };
}
export function vRequiredArray(msg) {
  return (v) => {
    if (Array.isArray(v) && v.length > 0) {
      return true;
    }
    return msg || 'Kötelező mező';
  };
}
export function vMaxLength(n, msg) {
  return (v) => {
    return v.length <= n || msg || `A maximális karakterszám ${n} lehet`;
  };
}
export function vMinLength(n, msg) {
  return (v) => {
    return v.length >= n || msg || `A minimális karakterszám ${n} lehet`;
  };
}
export function vMinNumber(n, msg = '') {
  return (v) => {
    let num = parseFloat((v + '').replace(/ /g, ''));
    if (!v) {
      return true;
    }
    return (
      (!isNaN(num) && num >= n) ||
      (msg + '').replace('_N_', n) ||
      `A szám értéke minimum ${n} lehet`
    );
  };
}
export function vMaxNumber(n, msg = '') {
  return (v) => {
    let num = parseFloat((v + '').replace(/ /g, ''));
    if (!v) {
      return true;
    }
    return (
      (!isNaN(num) && num <= n) ||
      (msg + '').replace('_N_', n) ||
      `A szám értéke maximum ${n} lehet`
    );
  };
}
export function vGtNumber(n, msg = '') {
  return (v) => {
    let num = parseFloat(v);
    return (
      (!isNaN(num) && num > n) ||
      msg ||
      `A számnak nagyobbnak kell lennie, mint  ${n}`
    );
  };
}
export function vLtNumber(n, msg = '') {
  return (v) => {
    let num = parseFloat(v);
    return (
      (!isNaN(num) && num < n) ||
      msg ||
      `A számnak kisebbnek kell lennie, mint  ${n}`
    );
  };
}
export function vGtDate(n, msg) {
  return (v) => {
    let date = parseISO(v);
    let dateParam = parseISO(n);
    if (!isValid(date)) return 'Dátum hiba';

    return (
      isAfter(date, dateParam) ||
      isSameMinute(date, dateParam) ||
      msg ||
      'Csak későbbi dátum adható meg'
    );
  };
}

export function vLtDate(n, msg) {
  return (v) => {
    let date = parseISO(v);
    let dateParam = parseISO(n);
    if (!isValid(date)) return 'Dátum hiba';
    return (
      isBefore(date, dateParam) ||
      isSameMinute(date, dateParam) ||
      msg ||
      'Csak korábbi dátum adható meg'
    );
  };
}
export function vDateIsvalid(msg) {
  return (v) => {
    let date = parseISO(v);
    if (!isValid(date)) return 'Dátum hiba';
    return true || msg || 'Nem valós dátum';
  };
}
export function vEmail(msg) {
  return (v) => {
    const re =
      /^([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
    return (
      re.test(String(v).toLowerCase()) ||
      msg ||
      'Hibás email formátum. Ékezetes betűket kérjük ne használjon.'
    );
  };
}
export function vTelephone(msg) {
  return (v) => {
    const re = /^\+36\d{7,}$/;
    return (
      re.test(String(v).toLowerCase()) ||
      msg ||
      'Hibás telefonszám (+123456789)'
    );
  };
}
export function vSameValue(otherValue, msg) {
  return (v) => {
    return v == otherValue || msg || 'A jelszavak nem egyeznek';
  };
}
export function vMinEletkor(n, msg) {
  return (v) => {
    let date = parseISO(v);
    let dateNow = new Date();

    if (!isValid(date)) return 'Dátum hiba';
    let minDate = sub(dateNow, { years: n });
    return (
      isAfter(minDate, date) ||
      isSameMinute(minDate, date) ||
      msg ||
      `${n} évnél fiatalabb nem regisztrálhat`
    );
  };
}
export function vMaxEletkor(n, msg) {
  return (v) => {
    let date = parseISO(v);
    let dateNow = startOfDay(new Date());

    if (!isValid(date)) return 'Dátum hiba';
    let minDate = sub(dateNow, { years: n });
    return (
      isBefore(minDate, date) ||
      isSameMinute(minDate, date) ||
      msg ||
      `${n} évnél idősebb nem regisztrálhat`
    );
  };
}
export function vNumberOnly(msg) {
  let re = /^([0-9])+$/;
  return (v) => {
    if (!v && v !== 0) {
      return true;
    }
    return re.test(v + '') || msg || 'Csak szám adható meg';
  };
}
export function vNumberLetterSpaceOnly(msg) {
  let re = /^([a-zA-Z0-9\u00C0-\u017F]| |\.|-)+$/;
  return (v) => {
    return re.test(v + '') || msg || 'Csak betű, szám és szóköz adható meg';
  };
}
export function vLetterSpaceOnly(msg) {
  let re = /^([a-zA-Z\u00C0-\u017F]| |\.|-)+$/;
  return (v) => {
    return re.test(v + '') || msg || 'Csak betű és szóköz adható meg';
  };
}
export function vVernyomas(msg) {
  let re = /^\d{1,3}\/\d{1,3} \d{1,3}$/;
  return (v) => {
    return !v || re.test(v + '') || msg || 'pl: 190/152 123';
  };
}

export const nameRules = [
  v => !!v || 'Név kötelező',
  v => v.length >= 2 || 'A névnek minimum 2 karakter hosszúnak kell lennie'
];

export const emailRules = [
  v => !!v || 'Email kötelező',
  v => /.+@.+\..+/.test(v) || 'Érvénytelen email cím'
];

export const passwordRules = [
  v => !!v || 'Jelszó kötelező',
  v => v.length >= 6 || 'A jelszónak minimum 6 karakter hosszúnak kell lennie'
];

export const createPasswordConfirmRule = (password) => [
  v => !!v || 'Jelszó megerősítése kötelező',
  v => v === password || 'A jelszavak nem egyeznek'
];
