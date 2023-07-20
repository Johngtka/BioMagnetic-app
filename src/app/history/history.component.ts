import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';

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
    @ViewChild(MatPaginator) paginator: MatPaginator;
    showSearch: boolean;
    patient: Patient;
    dataSource: MatTableDataSource<Visit, MatTableDataSourcePaginator>;
    displayedColumns: string[] = ['date', 'points', 'note'];
    showEmptyState = false;
    isLoadingResults = false;
    constructor(private visitService: VisitService) {}

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
        this.showSearch = true;
        this.getPatientVisit();
    }

    toggleTableVisibility(): void {
        this.patient = {} as Patient;
        this.showEmptyState = false;
        this.dataSource = new MatTableDataSource<Visit>([]);
        console.clear();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight' && this.paginator.hasNextPage()) {
            this.paginator.nextPage();
        } else if (
            event.key === 'ArrowLeft' &&
            this.paginator.hasPreviousPage()
        ) {
            this.paginator.previousPage();
        }
    }

    private getPatientVisit(): void {
        this.isLoadingResults = true;
        this.visitService.getVisits(this.patient._id).subscribe({
            next: (data) => {
                if (data.length === 0) {
                    this.showEmptyState = true;
                }
                this.dataSource = new MatTableDataSource<Visit>(data);
                this.isLoadingResults = false;
                this.dataSource.paginator = this.paginator;
            },
            error: (err) => {
                this.isLoadingResults = false;
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
