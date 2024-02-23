import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    HostListener,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, Subject, catchError, finalize, map, of } from 'rxjs';
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
    events$: Observable<any>;

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    activeDayIsOpen = false;
    viewDate = new Date();
    isLoadingEvents = true;
    isError = false;
    locale = navigator.language;

    ngOnInit(): void {
        this.events$ = this.companyService.getAppointments().pipe(
            map((data: Appointment[]) => {
                return data.length
                    ? data.map((appointment) => {
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
                      })
                    : [];
            }),

            catchError((error) => {
                this.isError = true;
                return of(`Error: ${error}`);
            }),
            finalize(() => (this.isLoadingEvents = false)),
        );
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
