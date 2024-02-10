import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { Company } from '../models/company';
import { Appointment } from '../models/appointment';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    constructor(private http: HttpClient) {}

    apiURL = environment.API_URL;

    getCompany(): Observable<Company> {
        return this.http.get<Company>(this.apiURL + '/company');
    }

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<any>(this.apiURL + '/appointment').pipe(
            map((appointmentFromBackend) => {
                return appointmentFromBackend.data.map((afb) => {
                    return {
                        startDateTime: afb.start_datetime,
                        endDateTime: afb.end_datetime,
                        duration: afb.duration,
                        service: {
                            name: afb.service.name,
                            price: afb.service.price,
                        },
                        client: {
                            name: afb.client.name,
                            email: afb.client.email,
                            phone: afb.client.phone,
                        },
                    };
                });
            }),
        );
    }
}
