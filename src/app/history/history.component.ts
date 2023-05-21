import { Component, OnInit } from '@angular/core';

import { Visit } from '../models/visit';
import { Patient } from '../models/patient';
import { VisitService } from '../services/visit.service';
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
    emptyState = true;
    isLoadingResults = true;
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
            this.getPatientVisit();
        }
    }
    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
        this.getPatientVisit();
    }

    toggleTableVisibility(): void {
        this.patient = {} as Patient;
        this.emptyState = false;
        this.dataSource = [];
        console.clear();
    }

    private getPatientVisit(): void {
        this.visitService.getVisits(this.patient._id).subscribe({
            next: (data) => {
                if (data.length >= 1) {
                    this.dataSource = data;
                    this.emptyState = true;
                    this.isLoadingResults = false;
                } else {
                    this.emptyState = false;
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
