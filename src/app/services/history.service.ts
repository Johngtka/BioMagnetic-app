import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { enviroment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    constructor(private http: HttpClient) {}

    apiURL = enviroment.API_URL;

    createVisit(visit): Observable<Store> {
        return this.http.post<Store>(this.apiURL + '/history', visit);
    }
}
