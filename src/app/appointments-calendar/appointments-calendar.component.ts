import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    HostListener,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';

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
    refresh = new Subject<void>();
    view: CalendarView = CalendarView.Month;
    dataSource: CalendarEvent[];

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    fullyMonthCompose: string;
    activeDayIsOpen = false;
    viewDate = new Date();

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
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            this.goToNextView();
        } else if (event.key === 'ArrowLeft') {
            this.goToPreviousView();
        }
    }

    goToNextView() {
        const nextButton = document.querySelector(
            'button[mwlCalendarNextView]',
        );
        if (nextButton) {
            (nextButton as HTMLElement).click();
        }
    }

    goToPreviousView() {
        const previousButton = document.querySelector(
            'button[mwlCalendarPreviousView]',
        );
        if (previousButton) {
            (previousButton as HTMLElement).click();
        }
    }
}
