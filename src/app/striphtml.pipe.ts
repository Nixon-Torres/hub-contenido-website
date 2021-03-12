import { Pipe, PipeTransform } from '@angular/core';

/*
 * Strips HTM
 * Takes an input parameter HTML.
 * Usage:
 *   content | striphtml
 * Example:
 *   <p [innerHTML]="content | striphtml"></p>
*/
@Pipe({
  name: 'striphtml'
})
export class StripHtmlPipe implements PipeTransform {
  stripHtml(html) {
    // Create a new div element
    let temporalDivElement = document.createElement('div');
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  }

  transform(value: any): any {
    if (!value || (value === null) || (value === '')) {
      return '';
    } else {
      value = value.replace(/&nbsp;/g, '');
      return this.stripHtml(value.replace(/<(?:.|\n)*?>/gm, ' '));
    }
  }
}
