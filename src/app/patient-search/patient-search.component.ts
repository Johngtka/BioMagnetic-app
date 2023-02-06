import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'rxjs/operators';

import { PatientService } from '../services/patient-service';

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
    private patientService: PatientService
  ) { }

  onSelected() {
    console.log(this.selectedPatient);
    this.selectedPatient = this.selectedPatient;
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
      )
      .subscribe((query: string) => {
        this.patientService.PatientSearch(query)
          .subscribe({
            next: (data: any[]) => (this.filteredPatients = data),
            error: (err) => console.log('error', err),
          })
          .add(() => (this.isLoading = false))
      });
  }
}

