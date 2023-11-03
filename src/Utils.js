import {
  extend,
  Loading,
  Notify,
  QSpinnerCube,
} from 'quasar';

export default class Utils {
  static formatDateToLocal(date) {
    return new Date(date).toLocaleDateString();
  }

  // to delete in refactoring
  static formatToLocal(date) {
    return new Date(date).toLocaleString();
  }

  static formatNumbersToLocal(data) {
    return data ? data.toLocaleString() : data;
  }

  static formatNumberWithPercent(dataNumber) {
    return dataNumber.toLocaleString(
      undefined,
      { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 0 },
    );
  }

  static showLoader(message = null) {
    Loading.show({
      spinner: QSpinnerCube,
      spinnerColor: 'secondary',
      backgroundColor: 'primary',
      message: message || 'Please wait',
      messageColor: '#6A6A6A',
    });
  }

  static closeLoader() {
    Loading.hide();
  }

  static showNotify(messages, typeOf = 'negative') {
    Notify.create({
      color: typeOf === 'negative' ? 'red-5' : 'green-5',
      type: typeOf,
      icon: typeOf === 'negative' ? 'warning' : 'check',
      textColor: 'white',
      message: messages,
    });
  }

  // eslint-disable-next-line consistent-return
  static deepCloneObj(obj, isDeep = false, targetObj = null) {
    // is deep for deep clone
    // target obj as call back
    if (targetObj) {
      extend(isDeep, targetObj, obj);
    } else {
      targetObj = {};
      extend(isDeep, targetObj, obj);
      return targetObj;
    }
  }
}
