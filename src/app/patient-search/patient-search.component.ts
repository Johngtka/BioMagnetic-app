import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
})
export class PatientSearchComponent {
  FormControl = new FormControl('')
}
