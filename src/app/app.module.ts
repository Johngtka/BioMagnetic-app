import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientService } from './services/patient-service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PatientTableComponent } from './patient-table/patient-table.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}
const navigatorLang = navigator.language.split('-')[0];
const supportedLang = ['pl', 'es', 'en'];
const lang = supportedLang.includes(navigatorLang) ? navigatorLang : 'en';

const materialModules = [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTableModule,
];

@NgModule({
    declarations: [
        AppComponent,
        PatientSearchComponent,
        HomeComponent,
        AboutComponent,
        PatientTableComponent,
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
    providers: [PatientService],
    bootstrap: [AppComponent],
})
export class AppModule {}
