import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ISvcEvent } from '../interface-models/svc-events'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { APIService } from '../api.service';
import { map, tap } from "rxjs/operators";

@Component({
    selector: 'sch-schedulers',
    templateUrl: './scheduler-main.component.html'
})

export class SchedulerMainComponent {
    //Title and popup variables
    title: string = 'Scheduler - Main';
    bearerToken: string = '';
    popEventName: string = '';
    popEventStart: string = this.datepipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss') ?? '';
    popEventEnd: string = this.datepipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss') ?? '';
    popEventDuration: string = ((Date.parse(this.popEventEnd) - Date.parse(this.popEventStart)) / 1000 / 60).toFixed(2).toString();
    popClipLocation: string = '';
    popRecordingChannel: string = '';

    //Event list variables
    arrayEvents: any[] = [];
    modifyEventIndex?: number = undefined;

    constructor(private _APIService: APIService, private modalService: NgbModal, private datepipe: DatePipe) {}

    //On popup modal OK button click
    popupOKClick(): void {
      if (this.modifyEventIndex == undefined) 
        this.postClick(); 
      else 
        this.updateClick();
    }

    //Popup modal OK click for Adding Event
    postClick(): void {
      this._APIService.postEvent({
        "name:text": this.popEventName,
        "start:dateTime": new Date(this.popEventStart),
        "end:dateTime" : new Date(this.popEventEnd),
        "source": { "channel:text": this.popRecordingChannel },
        "folder:id": this.popClipLocation
      }, new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.bearerToken}` })).subscribe(res=>{
      console.log(res);
      this.processEventsResult(res);
      this.modalService.dismissAll('Add Event successful');
     },
     err=>{
       console.log(err);
       alert(JSON.stringify(err));
     });
    }

    //Popup modal OK click for Modifying Event
    updateClick(): void {
      //Getting and updating the event data based on the list index of Modify Button click
      let event = this.arrayEvents[this.modifyEventIndex ?? 0];
      event['name:text'] = this.popEventName;
      event['start:dateTime'] = new Date(this.popEventStart);
      event['end:dateTime'] = new Date(this.popEventEnd);
      event['source'] = { "channel:text": this.popRecordingChannel };
      event['folder:id'] = this.popClipLocation;

      this._APIService.updateEvent(event['event:id'] ?? '', {
        "start:dateTime": event['start:dateTime'],
        "end:dateTime" : event['end:dateTime'],
        "source": event['source'],
        "folder:id": event['folder:id']
      }, new HttpHeaders({
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${this.bearerToken}` })).subscribe(res=>{
      console.log(res);
      //Updating the event data from the list
      this.arrayEvents[this.modifyEventIndex ?? 0] = event;
      this.modalService.dismissAll('Modify Event successful');
     },
     err=>{
       console.log(err);
       alert(JSON.stringify(err));
     });
    }

    //Delete button click based on list index
    deleteClick(id: any, index: any): void {
      if(!confirm("Are you sure to delete?"))
        return;

      this._APIService.deleteEvent(id, new HttpHeaders({'Authorization': `Bearer ${this.bearerToken}` })).subscribe(ev => {
        console.log(ev);
        //Remove the related event index from the list
        this.arrayEvents.splice(index, 1);
      },
      err=>{
        console.log(err);
        alert(JSON.stringify(err));
      })      
    }

    //Function called to process the received Event Add result. Will call get function for info on the created event
    //and push into the Event listing.
    processEventsResult(res: ISvcEvent): void {
      let id = res['event:id']!;
      
      this._APIService.getEvent(id, new HttpHeaders({'Authorization': `Bearer ${this.bearerToken}` }))
      .pipe(
        tap(data => console.log('Ori Data: ', JSON.stringify(data))),
        map(data => ({        
          "event:id": data['event:id'] ?? '',
          "name:text": data['name:text'] ?? '',
          "status:enum": data['status:enum'] ?? '',
          "start:dateTime": data['start:dateTime'] ?? '',
          "end:dateTime": data['end:dateTime'] ?? '',
          "source": data['source'] ?? '',
          "folder:id": data['folder:id'] ?? ''        
        }))
      )
      .subscribe(ev => {
        console.log(ev);
        this.arrayEvents.push(ev);
      },
      err=>{
        console.log(err);
        if (err.status == 404) //If no shceduled event was created
          alert('Unsuccessful Add Event, possible event conflict occured. Error: \n\n' + JSON.stringify(err));
        else
          alert(JSON.stringify(err));
      })      
    }

    //Function to call to recalculate the event duration
    calcDuration(): void {
      if (this.popEventStart != '' && this.popEventEnd != '')
        this.popEventDuration = ((Date.parse(this.popEventEnd) - Date.parse(this.popEventStart)) / 1000 / 60).toFixed(2).toString();
    }

    //Function to call to refresh the event listing. Get latest data for all
    refreshList(): void {
      this.arrayEvents.forEach(event =>{
        this._APIService.getEvent(event['event:id'] ?? '', 
        new HttpHeaders({'Authorization': `Bearer ${this.bearerToken}` }))
        .pipe(
          tap(data => console.log('Ori Data: ', JSON.stringify(data))),
          map(data => ({
            //Replaces the values as accordingly to the get service
            [event['event:id']]: data['event:id'] ?? '',
            [event['name:text']]: data['name:text'] ?? '',
            [event['status:enum']]: data['status:enum'] ?? '',
            [event['start:dateTime']]: data['start:dateTime'] ?? '',
            [event['end:dateTime']]: data['end:dateTime'] ?? '',
            [event['source']]: data['source'] ?? '',
            [event['folder:id']]: data['folder:id'] ?? ''
          }))
        )
        .subscribe(ev => {
          console.log(ev);
          event = ev;
        },
        err=>{
          console.log(err);
          alert(JSON.stringify(err));
        })
      })
    }

    //Function to call to open the modal dialog
    open(content: any): void;
    open(content: any, index: any): void;
    open(content: any, index: any, event: ISvcEvent): void;
    open(content: any, index?: any, event?: ISvcEvent): void {
      //If coming from Event listing, modifyEventIndex to be given the index value of the event list array
      this.modifyEventIndex = index;
      //Replace the modal popup values according to the event listing
      if (event)
      {        
        this.popEventName = event['name:text'] ?? '';
        this.popEventStart = this.datepipe.transform(event['start:dateTime'], 'MM/dd/yyyy HH:mm:ss') ?? '';
        this.popEventEnd = this.datepipe.transform(event['end:dateTime'], 'MM/dd/yyyy HH:mm:ss') ?? '';
        this.popRecordingChannel = event["source"]!["channel:text"] ?? '';
        this.popClipLocation = event['folder:id'] ?? '';
      }
      this.modalService.open(content);
    }
}