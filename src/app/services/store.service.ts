import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { enviroment } from '../environments/environment.dev';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    apiURL = enviroment.API_URL;
    constructor(private http: HttpClient) {}

    getStore(): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(this.apiURL + '/store');
    }
}
