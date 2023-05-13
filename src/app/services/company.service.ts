import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Company } from '../models/company';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    apiURL = environment.API_URL;

    constructor(private http: HttpClient) {}

    getCompany(): Observable<Company> {
        return this.http.get<Company>(this.apiURL + '/company');
    }
}
