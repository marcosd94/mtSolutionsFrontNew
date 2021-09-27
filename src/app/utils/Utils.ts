import { AbstractControl } from '@angular/forms';

export function changeFormatDate(date: any): string {
    let dateAux = date.split('T');

    if (dateAux) {
        return dateAux[0];
    }

    return '';
}

export function stringToDate(dateStr: string) {

    let aux = dateStr.split('-');

    return new Date(parseInt(aux[0]), (parseInt(aux[1]) - 1), parseInt(aux[2]));

}

export function returnDiaStr(diaNro: number): string {

    let retorno = '';

    switch (diaNro) {
      case 1:
        retorno = 'LU';
        break;
      case 2:
        retorno = 'MA';
        break;
      case 3:
        retorno = 'MI';
        break;
      case 4:
        retorno = 'JU';
        break;
      case 5:
        retorno = 'VI';
        break;
      case 6:
        retorno = 'SA';
        break;
      case 0:
        retorno = 'DO';
        break;
    }

    return retorno;
  }

export function stringToDateFormat(_date: string, _format: string, _delimiter: string) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    let formatedDate = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
    return formatedDate;
}

export class CustomValidator {
    // Number only validation
    static numeric(control: AbstractControl) {
        let val = control.value;

        if (val === null || val === '') return null;

        if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'numeric': true };

        if (parseInt(val) < 0) return { 'numeric': true };

        return null;
    }

    static selecInvalid(control: AbstractControl) {

        let val = control.value;

        if (val == -1) {
            return {
                selecInvalid: true
            }
        }

        return null

    }
}

export function dataURItoBlob(dataURI: any) {

    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
    
}

/**
 * 
 * Genera un objeto blob desde la secuencia de
 * string pasada como parámetro
 * 
 * @param data 
 * @param filename
 */
export function generarBlobForPDF(data: string, mimeType: string = 'application/pdf') {

    let x: string = atob(data);

    let buffer = new ArrayBuffer(x.length);
    let view = new Uint8Array(buffer);

    for (var n = 0; n < x.length; n++) {
        view[n] = x.charCodeAt(n);
    }

    return new Blob([buffer], { type: mimeType });
}

export function cloneValue(info:any): any {
    
    return  JSON.parse(JSON.stringify(info));

}
