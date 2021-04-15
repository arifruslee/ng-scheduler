import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ISvcEvent } from "./interface-models/svc-events";

@Injectable({ providedIn: 'root'})

export class APIService {
    constructor(private _http: HttpClient) {}

    postEvent(event: ISvcEvent, headers: HttpHeaders): Observable<ISvcEvent> {
        return this._http.post("https://uptime2.gvnewsdev.com/api/v1/store/schedule/events", event, { headers: headers })
    }

    getEvent(id: string, headers: HttpHeaders): Observable<ISvcEvent> {
      return this._http.get("https://uptime2.gvnewsdev.com/api/v1/store/schedule/events/" + id, { headers: headers })
    }

    deleteEvent(id: string, headers: HttpHeaders): Observable<ISvcEvent> {
      return this._http.delete("https://uptime2.gvnewsdev.com/api/v1/store/schedule/events/" + id, { headers: headers })
    }

    updateEvent(id: string, event: ISvcEvent, headers: HttpHeaders): Observable<ISvcEvent> {
      return this._http.patch("https://uptime2.gvnewsdev.com/api/v1/store/schedule/events/" + id, event, { headers: headers })
    }
}