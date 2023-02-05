import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

// import { PatientService } from '../services/patient-service';

const API_KEY = "e8067b53"
export interface User {
  name: string;
}
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient.styles.css'],

})
export class PatientSearchComponent implements OnInit {
  searchPatientsCtrl = new FormControl();
  filteredPatients: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedPatient: any = "";

  constructor(
    private http: HttpClient
    // private patientService: PatientService
  ) { }

  onSelected() {
    console.log(this.selectedPatient);
    this.selectedPatient = this.selectedPatient;
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    this.selectedPatient = "";
    this.filteredPatients = [];
  }

  ngOnInit() {
    this.searchPatientsCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredPatients = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get('http://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data['Search'] == undefined) {
          this.errorMsg = data['Error'];
          this.filteredPatients = [];
        } else {
          this.errorMsg = "";
          this.filteredPatients = data['Search'];
        }
        console.log(this.filteredPatients);
      });
  }
}
