export const toFixedFunc = (value, digits = 2) => {
    const numericValue = Number(value);
    const fixedValue = numericValue.toFixed(digits);
  
    // Check if the decimal part is all zeros
    const decimalPart = fixedValue.split('.')[1];
    if (decimalPart && decimalPart.match(/^0+$/)) {
      // Format the number without decimal part
      const formatter = new Intl.NumberFormat('en-US');
      return formatter.format(numericValue);
    } else {
      // Format the number with two decimal places
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
      return formatter.format(fixedValue);
    }
  };
  
  export const toFixedWithoutCommas = (value, digits = 2) => {
    if (value) {
      const numericValue = Number(value.replace(/\,/g, ''));
      if (!isNaN(numericValue)) {
        return numericValue.toFixed(digits);
      }
    }
    return null;
  };
  
  export function convertLocalTimeToUTC(date) {
    const d = new Date(date);
  
    const year = d.getUTCFullYear();
    const month = ('0' + (d.getUTCMonth() + 1)).slice(-2); // Months are 0-based
    const day = ('0' + d.getUTCDate()).slice(-2);
    const hours = ('0' + d.getUTCHours()).slice(-2);
    const minutes = ('0' + d.getUTCMinutes()).slice(-2);
    const seconds = ('0' + d.getUTCSeconds()).slice(-2);
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  // export function convertUTCToLocalTime(utcDate) {
  //     return new Date(utcDate).toLocaleString();
  // }
  export function convertUTCToLocalTime(dateTimeString) {
    if (!dateTimeString || dateTimeString == 'NA') {
      return;
    }
  
    // const isValidDate = (date) => !isNaN(Date.parse(date));
    // if (!isValidDate(dateTimeString)) {
    //   return;
    // }
  
    let d;
    if (dateTimeString?.includes('T')) {
      d = new Date(dateTimeString);
    } else {
      const parts = dateTimeString?.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];
      const [year, month, day] = datePart.split('-');
      const [hours, minutes, seconds] = timePart.split(':');
      d = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    }
  
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are 0-based
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  export function activeTransactionStatus(value) {
    switch (Number(value)) {
      case 1:
        return 'approved';
      case 2:
        return 'rejected';
      case 3:
        return 'pending';
      default:
        return true;
    }
  }
  