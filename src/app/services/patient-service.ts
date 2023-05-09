import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Patient } from '../models/patient';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    apiUrl = environment.API_URL;
    constructor(private http: HttpClient) {}

    patientSearch(query: string): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(
            this.apiUrl + '/patient?patientName=' + query,
        );
    }

    getPatients(): Observable<Array<Patient>> {
        return this.http.get<Array<Patient>>(this.apiUrl + '/patient');
    }

    createPatient(patient: Patient): Observable<Patient> {
        return this.http.post<Patient>(this.apiUrl + '/patient', patient);
    }

    updatePatient(patient: Patient): Observable<Patient> {
        return this.http.put<Patient>(
            this.apiUrl + `/patient/${patient._id}`,
            patient,
        );
    }

    deletePatient(patientId: string): Observable<Patient> {
        return this.http.delete<Patient>(this.apiUrl + `/patient/${patientId}`);
    }
}
