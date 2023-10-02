import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    constructor(private http: HttpClient) {}

    apiURL = environment.API_URL;

    getStore(): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(
            this.apiURL + '/store?skip=0&limit=50',
        );
    }
}
