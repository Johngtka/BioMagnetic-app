import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) { }
  PatientSearch() {
    return this.http.get('http://localhost:3001/patient');
  }

}
