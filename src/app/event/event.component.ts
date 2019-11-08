import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Event } from '../models/event';

declare var google: any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event: Event;

  uluru: Object = { lat: 4.029837, lng: 9.687983 };
  map: Object;
  marker: Object;
  zoom: number = 10;

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('map', {static: true}) mapRef: ElementRef;
  ngAfterViewInit() {
    //used setTimeout google map is delayed in loading, in stackBlitz

    setTimeout(() => {
      this.map = new google.maps.Map(this.mapRef.nativeElement, {
        zoom: this.zoom,
        center: this.uluru
      });
      this.marker = new google.maps.Marker({
        position: this.uluru,
        map: this.map
      });

    }, 2000)

    //console.log(this.map.getZoom())
  }

}
