import { Component } from '@angular/core'

import { PatientService } from './../services/patient-service';
@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent {
  constructor(
    private patientService: PatientService
  ) { }
  ngOnInit(): void {
    this.patientService.getPatients().subscribe(patients => {

    })
  }
}
