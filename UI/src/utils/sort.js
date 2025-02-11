import { safeGetProp } from '@/utils/common';

export function strCompare(a, b, key) {
  return (a[key] + '').localeCompare(b[key] + '');
}

export function numberCompare(a, b, key) {
  return parseInt(a[key]) - parseInt(b[key]);
}

export function boolCompare(a, b, key) {
  return a[key] === b[key] ? 0 : a[key] ? -1 : 1;
}

export function sortWith(array, ...comparers) {
  array.sort((a, b) => {
    for (let i = 0; i < comparers.length; i++) {
      const cmp = comparers[i](a, b);
      if (cmp != 0 || i == comparers.length - 1) {
        return cmp;
      }
    }
  });
}

export function sortStr(key) {
  return function (a, b) {
    return (a[key] + '').localeCompare(b[key] + '');
  };
}

export function sortStrDesc(key) {
  return function (a, b) {
    return (b[key] + '').localeCompare(a[key] + '');
  };
}
export function sortNumber(key) {
  return function (a, b) {
    return parseInt(a[key], 10) - parseInt(b[key], 10);
  };
}

export function sortNumberDesc(key) {
  return function (a, b) {
    return parseInt(b[key], 10) - parseInt(a[key], 10);
  };
}

export function sortDate(key) {
  return function (a, b) {
    return new Date(a[key]).getTime() - new Date(b[key]).getTime();
  };
}

export function sortDateDesc(key) {
  return function (a, b) {
    return new Date(b[key]).getTime() - new Date(a[key]).getTime();
  };
}
export function sortDateDescDeep(key) {
  return function (a, b) {
    return (
      new Date(safeGetProp(b, key)).getTime() -
      new Date(safeGetProp(a, key)).getTime()
    );
  };
}
export function sortBool(key) {
  return function (a, b) {
    return a[key] === b[key] ? 0 : a[key] ? -1 : 1;
  };
}
export function sortBoolDesc(key) {
  return function (a, b) {
    return a[key] === b[key] ? 0 : a[key] ? 1 : -1;
  };
}
export function sortPriorityTop(key, value) {
  return function (a, b) {
    if (a[key] != value && b[key] == value) {
      return 1;
    }
    if (a[key] == value && b[key] != value) {
      return -1;
    }
    return 0;
  };
}
export function sortPriority(key, value) {
  return function (a, b) {
    if (a[key] != value && b[key] == value) {
      return -1;
    }
    if (a[key] == value && b[key] != value) {
      return 1;
    }
    return 0;
  };
}
