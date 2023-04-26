import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { Store } from '../models/store';
import { Patient } from '../models/patient';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';

@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
    ) {}
    patient!: Patient;
    displayedColumns: string[] = [
        'id',
        'negativePoint',
        'positivePoint',
        'name',
        'type',
        'image',
    ];
    dataSource:
        | Store[]
        | MatTableDataSource<Store, MatTableDataSourcePaginator>;
    ngOnInit(): void {
        this.patient = history.state;
        this.storeService.getStore().subscribe({
            next: (data) => (
                (this.dataSource = data.sort((a, b) => a.id - b.id)),
                (this.dataSource = new MatTableDataSource<Store>(
                    this.dataSource,
                )),
                (this.dataSource.paginator = this.paginator)
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
    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }
    toggleTableVisibility(): void {
        this.patient.name = null;
    }
    clickedRow(row): void {
        console.log(row);
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
}
