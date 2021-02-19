import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatTabGroup } from '@angular/material';

// import * as $ from 'jquery';

import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {

  private today: Date = new Date();
  codeForm: FormGroup;
  selectedIndex = 1;
  evts: Event[];
  evtsPromise: Promise<Event[]>;
  evtsInProgressPromise: Promise<Event[]>;
  evtsDonePromise: Promise<Event[]>;

  orderList = ['startDate', 'name', 'where'];
  searchTerm = '';
  nameFilter = { name: 'e' };

  events;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.getEvents();

    this.initForm();

    this.today.setHours(0, 0, 0, 0);
    const tomorrow: Date = new Date();
    tomorrow.setMonth(this.today.getDate() + 1);
    const lastMonth: Date = new Date();
    lastMonth.setMonth(this.today.getMonth() - 1);
    this.evts  = [
      {uid: '1', name: 'evt1', by: 'user1', owner: 'owner1', where: 'where1',
        startDate: this.today, endDate: tomorrow, creationDate: new Date()},
      {uid: '2', name: 'evt2', by: 'user2', owner: 'owner2', where: 'where2',
        startDate: this.today, endDate: tomorrow, creationDate: new Date()}
    ];
    this.changeTab(this.selectedIndex);
  }

  getEvents() {
    this.eventService.getEvents().subscribe(res => (this.events = res));
  }

  initForm() {
    this.codeForm = this.formBuilder.group({
      code: ['', Validators.required]
    });
  }

  saveEvent() {
    alert(this.codeForm.value.code);
  }

  changeTab(status) {
    if (status === 1) {
      this.evtsInProgressPromise = new Promise(resolve => {
        const evtsInProgress = this.evts.filter((elt: Event) => {
          return elt.startDate <= this.today && elt.endDate >= this.today;
        });
        window.setTimeout(() => resolve(evtsInProgress), 1000);
      });
    } else if (status === 2) {
      this.evtsDonePromise = new Promise(resolve => {
        const evtsDone = this.evts.filter((elt: Event) => {
          return elt.endDate < this.today;
        });
        window.setTimeout(() => resolve(evtsDone), 1000);
      });
    } else {
      this.evtsPromise = new Promise(resolve => {
        window.setTimeout(() => resolve(this.evts), 1000);
      });
    }
  }

  statusFilter() {
    return true;
  }

}
