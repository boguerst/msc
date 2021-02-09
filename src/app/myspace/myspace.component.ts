import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material';

// import * as $ from 'jquery';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();

    this.today.setHours(0, 0, 0, 0);
    const tomorrow: Date = new Date();
    tomorrow.setMonth(this.today.getDate() + 1);
    const lastMonth: Date = new Date();
    lastMonth.setMonth(this.today.getMonth() - 1);
    this.evts  = [
      new Event('1', 'evt1', 'user1', 'owner1', 'where1', this.today, tomorrow, new Date()),
      new Event('2', 'evt2', 'user2', 'owner2', 'where2', lastMonth, lastMonth, new Date())
    ];
    this.changeTab(this.selectedIndex);
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
          return elt.getStartDate() <= this.today && elt.getEndDate() >= this.today;
        });
        window.setTimeout(() => resolve(evtsInProgress), 1000);
      });
    } else if (status === 2) {
      this.evtsDonePromise = new Promise(resolve => {
        const evtsDone = this.evts.filter((elt: Event) => {
          return elt.getEndDate() < this.today;
        });
        window.setTimeout(() => resolve(evtsDone), 1000);
      });
    } else {
      this.evtsPromise = new Promise(resolve => {
        window.setTimeout(() => resolve(this.evts), 1000);
      });
    }
  }

  statusFilter(evt) {
    return true;
  }

}
