import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsCalendarComponent } from './appointments-calendar.component';

describe('AppointmentsCalendarComponent', () => {
    let component: AppointmentsCalendarComponent;
    let fixture: ComponentFixture<AppointmentsCalendarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppointmentsCalendarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentsCalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
