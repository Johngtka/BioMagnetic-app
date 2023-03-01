import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    constructor(private http: HttpClient) {}
    patientSearch(query: string): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(
            'http://localhost:3001/patient?patientName=' + query,
        );
    }
    getPatients(): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>('http://localhost:3001/patient');
    }
    createPatient(patient: object) {
        return this.http.post<Patient>(
            'http://localhost:3001/patient',
            patient,
        );
    }
}
