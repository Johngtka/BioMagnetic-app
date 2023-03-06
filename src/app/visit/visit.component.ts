import { Component } from '@angular/core';

import { Patient } from '../models/patient';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent {
    patient!: Patient;
    constructor(private route: ActivatedRoute) {}
    ngOnInit(): void {
        this.patient = this.route.snapshot.data['patient'];
    }
}
