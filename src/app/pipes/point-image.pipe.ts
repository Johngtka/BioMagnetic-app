import { Pipe, PipeTransform } from '@angular/core';

import { Store } from '../models/store';

@Pipe({
    name: 'pointImage',
})
export class PointImagePipe implements PipeTransform {
    transform(value: string, ...args: any[]): unknown {
        const point = args[0].find((store: Store) => store._id === value);
        if (point) {
            return point.image;
        } else {
            return undefined;
        }
    }
}
