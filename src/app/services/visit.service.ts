import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Visit } from '../models/visit';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class VisitService {
    constructor(private http: HttpClient) {}

    apiURL = environment.API_URL;

    createVisit(visit: Visit): Observable<Visit> {
        return this.http.post<Visit>(this.apiURL + '/visit', visit);
    }

    getVisits(patientId: string): Observable<Array<Visit>> {
        return this.http.get<Array<Visit>>(this.apiURL + `/visit/${patientId}`);
    }
}
