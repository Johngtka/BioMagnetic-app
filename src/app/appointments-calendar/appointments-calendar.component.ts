import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { CompanyService } from '../services/company.service';
import { Appointment } from '../models/appointment';

@Component({
    selector: 'app-appointments-calendar',
    templateUrl: './appointments-calendar.component.html',
    styleUrls: ['./appointments-calendar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsCalendarComponent implements OnInit {
    constructor(private companyService: CompanyService) {}
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    activeDayIsOpen = false;

    view: CalendarView = CalendarView.Month;

    fullyMonthCompose: string;
    viewDate = new Date();
    refresh = new Subject<void>();

    dataSource: CalendarEvent[];

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    ngOnInit(): void {
        this.companyService.getAppointments().subscribe({
            next: (data: Appointment[]) => {
                this.dataSource = data.map((appointment) => {
                    return {
                        start: new Date(appointment.startDateTime),
                        end: new Date(appointment.endDateTime),
                        meta: {
                            duration: appointment.duration,
                            service: appointment.service,
                            client: appointment.client,
                        },
                        title:
                            `${appointment.service.name} ` +
                            `${appointment.client.name}`,
                    };
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
        this.fullyMonthCompose =
            this.viewDate
                .toLocaleString('default', {
                    month: 'long',
                })
                .toUpperCase() +
            ' ' +
            this.viewDate.getFullYear();
    }

    dayClicked({
        date,
        events,
    }: {
        date: Date;
        events: CalendarEvent[];
    }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) &&
                    this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }
}
