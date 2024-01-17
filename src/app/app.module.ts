import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AgePipe } from './pipes/age.pipe';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PatientService } from './services/patient-service';
import { StoreService } from './services/store.service';
import { VisitComponent } from './visit/visit.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoryComponent } from './history/history.component';
import { EmptyStateComponent } from './empty.state/empty.state.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { UserInputDialogComponent } from './user-input-dialog/user-input-dial.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PointNamesPipe } from './pipes/point-names.pipe';
import { PointImagePipe } from './pipes/point-image.pipe';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, './assets/i18n/');
}
export function storeCollection(storeService: StoreService) {
    storeService.fetchStore();
}
const navigatorLang = navigator.language.split('-')[0];
const supportedLang = ['pl', 'es', 'en'];
const lang = supportedLang.includes(navigatorLang) ? navigatorLang : 'en';

const materialModules = [
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
];

@NgModule({
    declarations: [
        AppComponent,
        PatientSearchComponent,
        HomeComponent,
        AboutComponent,
        AgePipe,
        UserInputDialogComponent,
        VisitComponent,
        ConfirmationDialogComponent,
        HistoryComponent,
        EmptyStateComponent,
        PatientDetailsComponent,
        PointNamesPipe,
        PointImagePipe,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        LayoutModule,
        TranslateModule.forRoot({
            defaultLanguage: lang,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ...materialModules,
    ],
    providers: [
        PatientService,
        DatePipe,
        StoreService,
        {
            provide: APP_INITIALIZER,
            useFactory: storeCollection,
            deps: [StoreService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
