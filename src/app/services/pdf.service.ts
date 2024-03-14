import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CompanyService } from './company.service';
import { Store } from '../models/store';

@Injectable({
    providedIn: 'root',
})
export class PdfService {
    company: any;
    constructor(
        private translateService: TranslateService,
        private datePipe: DatePipe,
        private companyService: CompanyService,
    ) {
        this.companyService.getCompany().subscribe({
            next: (data) => {
                this.company = data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    preparePdf(visit: any, patient: any) {
        const pdfData = {
            fullName: patient.surname,
            logo: this.company.logo,
            image: this.company.image,
        };

        const docDefinition = {
            content: [
                {
                    image: pdfData.logo,
                },
                {
                    text: `${this.translateService
                        .instant('PATIENT_VISIT.PDF.TITLE')
                        .toUpperCase()} - ${pdfData.fullName.toUpperCase()} ${this.datePipe.transform(
                        Date.now(),
                        'dd/MM/yyyy',
                    )}`,
                    margin: [0, 10],
                },
                {
                    table: {
                        dontBreakRows: false,
                        headerRows: 1,
                        widths: [150, '*', 150],
                        body: visit
                            .filter((vt) => (vt as any).code.includes('P', 0))
                            .map((point) => this.getPdfRow(point as any)),
                    },
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.REMEMBER',
                    )}`,
                    color: '#92cddc',
                    pageBreak: 'before',
                    margin: [0, 10],
                    lineHeight: 2,
                    bold: true,
                },
                {
                    ul: [
                        this.translateService.instant(
                            'PATIENT_VISIT.PDF.GENERIC.POINT_1',
                        ),
                        this.translateService.instant(
                            'PATIENT_VISIT.PDF.GENERIC.POINT_2',
                        ),
                    ],
                    margin: [60, 0],
                    lineHeight: 2,
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.EMAIL',
                    )}: ${this.company.email}`,
                    color: '#92cddc',
                    margin: [0, 10],
                    lineHeight: 2,
                    bold: true,
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.TEXT',
                    )}`,
                    lineHeight: 2,
                },
                {
                    image: pdfData.image,
                    width: 520,
                    margin: [0, 10],
                },
            ],
        };
        // add table headers
        docDefinition.content[2].table.body.unshift([
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.IMBALANCE')
                    .toUpperCase(),
                alignment: 'center',
                bold: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            } as any,
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.POSITION')
                    .toUpperCase(),
                alignment: 'center',
                bold: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            },
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.INFO')
                    .toUpperCase(),
                bold: true,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            },
        ]);

        return docDefinition;
    }

    private getPdfRow(point: Store) {
        return [
            {
                text: point.negativePoint + '-' + point.positivePoint,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
            {
                image: point.image,
                width: 200,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
            {
                text: point.comment,
                alignment: 'center',
                italics: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
        ];
    }
}
