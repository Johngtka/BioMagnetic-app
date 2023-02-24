import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputDialComponent } from './user-input-dial.component';

describe('UserInputDialComponent', () => {
    let component: UserInputDialComponent;
    let fixture: ComponentFixture<UserInputDialComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserInputDialComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserInputDialComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
