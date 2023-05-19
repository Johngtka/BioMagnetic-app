import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Visit } from '../models/visit';
import { Patient } from '../models/patient';
import { VisitService } from '../services/visit.service';
import { NavigationObject } from '../models/NavigationObject';
import { EmptyStateComponent } from '../empty.state/empty.state.component';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
    constructor(
        private visitService: VisitService,
        private dialog: MatDialog,
    ) {}
    patient: Patient;
    dataSource: Visit[];
    displayedColumns: string[] = ['date', 'points', 'note'];
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
            this.visitService.getVisits(this.patient._id).subscribe({
                next: (data) => {
                    this.dataSource = data;
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.dialog.open(EmptyStateComponent);
        }
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
