import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../models/event';


@Pipe({
  name: 'eventFilter'
})
export class EventFilterPipe implements PipeTransform {

  // args : 1 - status = { 0 : all, 1 : in progress, 2 : done }
  // args : 2 - keyword = filter on the name
  transform(value: Event, ...args: any[]): any {
    switch (args.length) {
      case 1:
        // code...
        break;

      case 2:
        // code...
        break;
      
      default:
        // code...
        break;
    }
    return null;
  }

}
