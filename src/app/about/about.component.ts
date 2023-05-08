import { Component } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
})
export class AboutComponent {
    Title = environment.TITLE;
    version = environment.version;
}
