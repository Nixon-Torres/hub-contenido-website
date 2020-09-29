import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {Location} from '@angular/common';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  private categoryId: string;
  private reportTypeId: string;
  private companyId: string;
  public reportType: any;
  public category: any;
  public reportTypes: any;
  public reports: any;
  public pagesItems = [];
  public companyTypesSelect: any;
  public totalCount: number;
  public totalCountSum: number;
  public totalPages: number;
  public currentPage = 1;
  readonly ITEMS_PER_PAGE = 6;

  public assetBase: string = environment.URL_API;

  public idateStart: any;
  public idateEnd: any;

  public searchText: string;

  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    reportTypes: []
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    reportTypes: []
  }, {
    name: 'Divisas',
    code: 'DIVISAS',
    reportTypes: []
  }];

  constructor(private http: HttpService, private activatedRoute: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.searchText = params.s;
      this.currentPage = 1;
      this.getReports();
    });
  }

  scroll() {
    window.scrollTo(0, 0);
  }

  getBannerImg() {
    const defaultBanner = '../../../../assets/images/Imagen 3.png';
    if (!this.category || (this.category && !this.category.files)) {
      return defaultBanner;
    }

    const file = this.category.files.find(e => e.key === 'categoryBanner');
    return file ? this.assetBase + file.clientPath : defaultBanner;
  }

  getCategory() {
    this.http.get({
      path: `public/categories/`,
      data: {
        where: {
          id: this.categoryId
        },
        include: ['children', 'files', {
          relation: 'childrenMainReportTypes',
          scope: {
            include: ['subCategory']
          }
        }],
        limit: 1
      },
      encode: true
    }).subscribe((response: any) => {
      this.category = response.body[0];

      if (this.category.code === 'ANLISISDECOMPAAS') {
        this.companyId = this.reportTypeId;
        this.reportTypeId = null;
      }

      if (this.reportTypeId) {
        this.reportType = this.category.childrenMainReportTypes.find(e => e.id === this.reportTypeId);
      }

      if (this.category.code !== 'ANLISISDECOMPAAS') {
        this.reportTypes = this.category.childrenMainReportTypes.map(e => {
          const rsp = e;
          rsp.name = e.description;
          if (!rsp.subCategory) {
            return rsp;
          }
          rsp.subCategory = rsp.subCategory.filter(j => j.parentId === this.categoryId);
          return rsp;
        });

        if (this.category.code === 'ENQUINVERTIR') {
          this.investmentGroups = this.investmentGroups.map(e => {
            const subitems = this.reportTypes.filter(k => k.subCategory.find(h => h.code === e.code));
            e.reportTypes = subitems.reduce((a, b) => {
              if (!a.find(m => m.id === b.id)) {
                a.push(b);
              }
              return a;
            }, []);
            return e;
          });
        }

        this.getReports();
      } else {
        this.companyTypesSelect = this.category.childrenMainReportTypes;
        this.getCompanies();
      }
    });
  }

  getCompanies() {
    this.http.get({
      path: `public/companies/`,
    }).subscribe((response: any) => {
      this.reportTypes = response.body;
      this.getReports();
    });
  }

  isMenuActive(item: any) {
    return (item.id === this.reportTypeId) || (item.id === this.companyId);
  }

  getWhere() {
    const where: any = {name: {like: this.searchText, options: 'i'}};
    return where;
  }

  goBack() {
    this.location.back();
  }

  getReportCount() {
    const where = this.getWhere();

    return this.http.get({
      path: `public/search/count`,
      data: {where},
      encode: true
    })
  }

  getContentCount() {
    const where = Object.assign({}, this.getWhere(), {key: 'multimedia'});

    return this.http.get({
      path: `public/search/count`,
      data: {where, resource: 'contents'},
      encode: true
    });
  }

  getReports() {
    const where = this.getWhere();
    const skip = (this.currentPage - 1) * this.ITEMS_PER_PAGE;

    let reports = this.http.get({
      path: `public/search/`,
      data: {
        where,
        fields: ['id', 'name', 'smartContent', 'rTitle', 'publishedAt', 'reportTypeId'],
        include: [{
          relation: 'reportType',
          scope: {
            include: ['mainCategory', 'subCategory']
          }
        }],
        skip,
        limit: this.ITEMS_PER_PAGE,
        order: 'publishedAt DESC'
      },
      encode: true
    });

    let contents = this.http.get({
      path: `public/search/`,
      data: {
        where: Object.assign({}, where, {key: 'multimedia'}),
        fields: ['id', 'title', 'subtitle', 'description', 'createdAt', 'resourceId'],
        include: [{
          relation: 'reports',
          scope: {
            include: ['reportType']
          }
        }],
        skip,
        limit: this.ITEMS_PER_PAGE,
        order: 'createdAt DESC',
        resource: 'contents'
      },
      encode: true
    });

    forkJoin([reports, contents, this.getReportCount(), this.getContentCount()])
      .subscribe((results: any) => {
        const reports = results[0].body;
        const contents = results[1].body.map((e) => {
          return {
            rTitle: e.title,
            publishedAt: e.createdAt,
            smartContent: e.description,
            name: e.title,
            id: e.id,
            reportType: {description: 'Multimedia'},
            isContent: true
          };
        });
        const reportsCount = results[2].body.count;
        const contentsCount = results[3].body.count;

        const greaterNum = (reports.length > contents.length) ?
          reports.length : contents.length;
        this.reports = [];
        for (let i = 0; i < greaterNum; i++) {
          if (i < reports.length)
            this.reports.push(reports[i]);
          if (i < contents.length)
            this.reports.push(contents[i]);
        }

        this.totalCountSum = reportsCount + contentsCount;
        this.totalCount = reportsCount > contentsCount ? reportsCount : contentsCount;
        this.totalPages = Math.ceil(this.totalCount / this.ITEMS_PER_PAGE);
        this.pagesItems = [];
        for (let i = 0; i < this.totalPages; i++) {
          this.pagesItems.push(i + 1);
        }
    });
  }

  getResourceBase(report:any) {
    return report.isContent ? '/multimedia' : '/reports';
  }

  isANewReport(report: any) {
    const diff = moment().diff(report.publishedAt, 'hours');
    return !report.isContent && diff < 24;
  }

  getSubCategoryName() {
    if (this.companyId) {
      return this.reportTypes.find(e => e.id === this.companyId).name;
    } else if (this.reportType) {
      return this.reportType.description;
    }
    return '';
  }

  getReportSubCategoryName(reportType: any) {
    const name = reportType ? reportType.description : '';
    return name;
  }

  setCompanyReportType(reportType) {
    this.currentPage = 1;
    this.reportType = reportType;
    this.reportTypeId = reportType.id;
    this.getReports();
  }

  setReportType(reportType: any) {
    this.currentPage = 1;
    if (this.category.code === 'ANLISISDECOMPAAS') {
      this.companyId = reportType.id;
    } else {
      this.reportType = reportType;
      this.reportTypeId = reportType.id;
    }
    this.getReports();
  }

  pageChanged() {
    this.getReports();
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.getReports();
    this.scroll();
  }

  previousPage() {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.getReports();
    this.scroll();
  }

  setStartDate(date) {
    this.idateStart = date.value;
    this.getReports();
  }

  setEndDate(date) {
    this.idateEnd = date.value;
    this.getReports();
  }
}
