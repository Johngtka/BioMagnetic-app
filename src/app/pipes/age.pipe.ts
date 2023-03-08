import { Pipe, PipeTransform } from '@angular/core';

import { differenceInYears } from 'date-fns';

@Pipe({
    name: 'age',
})
export class AgePipe implements PipeTransform {
    transform(age: number) {
        if (age) {
            return differenceInYears(new Date(), new Date(age));
        } else {
            return '';
        }
    }
}
