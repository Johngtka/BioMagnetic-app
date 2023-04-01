import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Patient } from '../models/patient';
import { enviroment } from 'src/environments/environment.dev';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    apiURL = enviroment.API_URL;
    constructor(private http: HttpClient) {}

    getStore(): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(this.apiURL + '/store');
    }
}
