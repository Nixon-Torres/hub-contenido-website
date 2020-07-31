import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (completeWords) {
      limit = value && value.substr(0, limit).lastIndexOf(' ');
    }
    return value && value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
