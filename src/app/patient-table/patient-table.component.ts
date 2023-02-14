import { Component } from '@angular/core'
import { PatientService } from './../services/patient-service'
@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent {
  dataSource!: any[]
  constructor(
    private patientService: PatientService
  ) { }
  ngOnInit(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.dataSource = patients
    })
  }
  displayedColumns: string[] = ['name']
}
