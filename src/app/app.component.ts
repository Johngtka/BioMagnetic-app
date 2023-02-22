import { AfterViewInit, Component, ViewChild, Pipe } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { delay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;

    constructor(private observer: BreakpointObserver) { }

    ngAfterViewInit() {
        this.observer
            .observe(['(max-width: 800px)'])
            .pipe(delay(1), untilDestroyed(this))
            .subscribe((res: any) => {
                if (res.matches) {
                    this.sidenav.mode = 'over';
                    this.sidenav.close();
                } else {
                    this.sidenav.mode = 'side';
                    this.sidenav.open();
                }
            });
    }
}
