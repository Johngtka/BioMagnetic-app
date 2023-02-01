import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { AppComponent } from './app.component';
import { HttpLoaderFactory } from "./app.module";
const TRANSLATIONS_EN = require('../assets/i18n/en.json');
const TRANSLATIONS_PL = require('../assets/i18n/pl.json');
const TRANSLATIONS_ES = require('../assets/i18n/es.json');

describe('AppComponent', () => {
  let translate: TranslateService;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [TranslateService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('en');
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('title').textContent).toEqual('');

    // en-pl
    http.expectOne('/assets/assets/en.json').flush(TRANSLATIONS_EN);
    http.expectNone('/assets/assets/pl.json');
    http.verify();
    fixture.detectChanges();
    expect(compiled.querySelector('title').textContent).toEqual(TRANSLATIONS_PL.TITLE);

    // en-es
    http.expectOne('/assets/assets/en.json').flush(TRANSLATIONS_EN);
    http.expectNone('/assets/assets/es.json');
    http.verify();
    fixture.detectChanges();
    expect(compiled.querySelector('title').textContent).toEqual(TRANSLATIONS_ES.TITLE);
  }));

});
