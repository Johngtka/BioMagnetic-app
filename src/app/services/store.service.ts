import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    apiURL = environment.API_URL;
    constructor(private http: HttpClient) {}

    getStore(): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(this.apiURL + '/store');
    }
}
