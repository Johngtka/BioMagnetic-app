import { Component } from '@angular/core';
import { SnackService } from '../services/snack.service';
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  providers: [SnackService]
})
export class SnackbarComponent {
}
