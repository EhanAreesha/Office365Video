import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numTochar'
})
export class NumTwoCharPipe implements PipeTransform {

  transform(value: number): string {
    let option: string;
    switch (value) {
      case 1:
        option = 'a) ';
        break;
      case 2:
        option = 'b) ';
        break;
      case 3:
        option = 'c) ';
        break;
      case 4:
        option = 'd) ';
        break;
      case 5:
        option = 'e) ';
        break;
      default:
        option = ''
        break;
    }
    return option;
  }

}
