import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '../models/store';
import { Patient } from '../models/patient';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';

@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent implements OnInit, AfterViewInit {
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
    ) {}
    @ViewChild(MatPaginator) paginator: MatPaginator;
    patient!: Patient;
    store!: Store[];
    displayedColumns: string[] = [
        'id',
        'negativePoint',
        'positivePoint',
        'name',
        'type',
        'image',
    ];
    dataSource;
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    ngOnInit(): void {
        this.patient = history.state;
        this.storeService.getStore().subscribe({
            next: (data) => (
                (this.store = data.sort((a, b) => a.id - b.id)),
                (this.dataSource = new MatTableDataSource<Store>(data))
            ),
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }
    selectPatient(patientSelected: Patient) {
        this.patient = patientSelected;
    }
}
