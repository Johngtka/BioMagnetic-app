import { Component } from '@angular/core'
import { OnInit } from '@angular/core'

import { FormControl } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'
import { tap } from 'rxjs/operators'
import { distinctUntilChanged } from 'rxjs/operators'
import { filter } from 'rxjs/operators'

import { PatientService } from '../services/patient-service'
import { Patient } from '../models/patient'

export interface User {
  name: string
}
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
})
export class PatientSearchComponent implements OnInit {
  searchPatientsCtrl = new FormControl()
  filteredPatients!: Array<Patient>
  isLoading = false
  errorMsg!: string
  minLengthTerm = 3

  constructor(private patientService: PatientService) {}

  onSelected() {
    console.log(this.searchPatientsCtrl.value)
  }

  displayWith(value: any) {
    return !!value ? value.name : ''
  }

  clearSelection() {
    this.searchPatientsCtrl.setValue('')
    this.filteredPatients = []
  }

  ngOnInit() {
    this.searchPatientsCtrl.valueChanges
      .pipe(
        filter((res) => {
          return !!res && res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = ''
          this.filteredPatients = []
          this.isLoading = true
        }),
      )
      .subscribe((query: string) => {
        this.patientService
          .patientSearch(query)
          .subscribe({
            next: (data: Array<Patient>) => (this.filteredPatients = data),
            error: (err) => (this.errorMsg = err.message),
          })
          .add(() => (this.isLoading = false))
      })
  }
}
