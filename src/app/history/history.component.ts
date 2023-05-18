import { Component, OnInit } from '@angular/core';

import { Visit } from '../models/visit';
import { VisitService } from '../services/visit.service';
import { Patient } from '../models/patient';
import { NavigationObject } from '../models/NavigationObject';
@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
    constructor(private visitService: VisitService) {}
    patient: Patient;
    dataSource: Visit[];
    displayedColumns: string[] = ['date', 'points', 'note'];
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
        this.visitService.getVisits(this.patient._id).subscribe({
            next: (data) => {
                this.dataSource = data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }
    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
