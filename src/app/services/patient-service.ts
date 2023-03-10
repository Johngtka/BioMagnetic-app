import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Patient } from '../models/patient';
import { enviroment } from '../env/enviroment.dev';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    apiurl = enviroment.API_URL;
    constructor(private http: HttpClient) {}
    patientSearch(query: string): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(this.apiurl + '/patient' + query);
    }
    getPatients(): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(this.apiurl + '/patient');
    }
    createPatient(patient: object) {
        return this.http.post<Patient>(
            this.apiurl + '/patient?patientName=',
            patient,
        );
    }
}
