import {Component, OnInit, Sanitizer, ViewEncapsulation} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {
    public myhtml: any;
    public report: any;
    public reportId: string;

    constructor(private http: HttpService, private activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((params: any) => {
            // Load report for edit, but if is a new report load basic data from URI
            if (params.get('id')) {
                this.reportId = params.get('id');
                this.loadReport(this.reportId);
            }
        });
    }

    loadReport(reportId: string) {
        const filter = {
            where: {
                id: reportId
            }
        };
        this.http.getHTML({
            path: `public/reports/${this.reportId}/view`,
            data: filter,
            encode: true
        }).subscribe((res) => {
            const html = (res.body as unknown as string).replace(/\/public\/reports\//g, environment.URL_API + 'public/reports/');
            this.myhtml = this.sanitizer.bypassSecurityTrustHtml(html);
        });
    }
}
