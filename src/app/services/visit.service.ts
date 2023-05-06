import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Visit } from '../models/visit';
import { environment } from 'src/environments/environment.dev';

@Injectable({
    providedIn: 'root',
})
export class VisitService {
    constructor(private http: HttpClient) {}

    apiURL = environment.API_URL;

    createVisit(visit: Visit): Observable<Visit> {
        return this.http.post<Visit>(this.apiURL + '/visit', visit);
    }
}
