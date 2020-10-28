import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {combineLatest} from 'rxjs';
import { MatInput } from '@angular/material';
import {GoogleTagManagerService} from 'angular-google-tag-manager';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  private categoryId: string;
  private reportTypeId: string;
  private subcategoryId: string;
  private companyId: string;
  public reportType: any;
  public category: any;
  public reportTypes: any;
  public reports: any;
  public pagesItems = [];
  public companyTypesSelect: any;
  public totalCount: number;
  public totalPages: number;
  public currentPage = 1;
  readonly ITEMS_PER_PAGE = 6;
  @ViewChild('input', { static: false }) input: MatInput;
  @ViewChild('inputEnd', { static: false }) inputEnd: MatInput;
  public breadcrumbItems: Array<any> = [];

  public assetBase: string = environment.URL_API;

  public idateStart: any;
  public idateEnd: any;
  public idateLowLimit: any;
  public idateHighLimit: any;

  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    reportTypes: [],
    id: null,
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    reportTypes: [],
    id: null,
  }, {
    name: 'Monedas',
    code: 'DIVISAS',
    reportTypes: [],
    id: null,
  }];

  constructor(private http: HttpService, private activatedRoute: ActivatedRoute, private router: Router, private gtmService: GoogleTagManagerService) {
  }

  ngOnInit() {
    this.currentPage = 1;
    const obs = [this.activatedRoute.queryParams, this.activatedRoute.paramMap];

    const oparams = this.activatedRoute.params;
    const oqueryParams = this.activatedRoute.queryParams;

    combineLatest(oparams, oqueryParams,
      (iparams, iqueryParams) => ({ iparams, iqueryParams }))
      .subscribe(response => {
        const queryParams = response.iqueryParams;
        const params = response.iparams;
        this.categoryId = null;
        this.reportTypeId = null;
        this.subcategoryId = null;

        if (params.id) {
          this.categoryId = params.id;
        }

        if (params.typeid) {
          this.reportTypeId = params.typeid;
        }

        if (queryParams.subcategory) {
          this.subcategoryId = queryParams.subcategory;
        }

        if (this.categoryId) {
          this.getCategory();
        }
      });
  }

  getBannerImg() {
    const defaultBanner = null;
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
            order: ['order ASC', 'description ASC'],
            include: ['subCategory', {
              relation: 'children',
              scope: {
                include: 'subCategory',
              },
            }],
          }
        }],
        limit: 1
      },
      encode: true
    }).subscribe((response: any) => {
      this.category = response.body[0];

      const params = this.category && this.category.params ? this.category.params : {};
      const alphabetic = params.sorting && params.sorting === 'alphabetic';

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
        }).filter(e => !!!e.parentId)
          .sort((a, b) => {
            if (alphabetic) {
              const nameA = this.getReportTypeName(a).toLowerCase();
              const nameB = this.getReportTypeName(b).toLowerCase();
              if (nameA > nameB) {
                return 1;
              } else if (nameA < nameB) {
                return -1;
              } else {
                return 0;
              }
            } else {
              if (a.order > b.order) {
                return 1;
              } else if (a.order < b.order) {
                return -1;
              } else {
                return 0;
              }
            }
          });

        if (this.category.code === 'ENQUINVERTIR') {
          this.investmentGroups = this.investmentGroups.map(e => {
            const subitems = this.reportTypes.filter(k => k.subCategory.find(h => h.code === e.code));
            const subcat = subitems.length ? subitems[0].subCategory : {};

            e.id = subcat && subcat.length ? subcat[0].id : null;
            e.reportTypes = subitems.reduce((a, b) => {
              if (!a.find(m => m.id === b.id)) {
                a.push(b);
              }
              return a;
            }, []);
            return e;
          });

          const cat = this.investmentGroups.find(e => e.id === this.subcategoryId);
        }

        this.getReports();
        this.updateBreadcrumbItems();
      } else {
        this.companyTypesSelect = this.category.childrenMainReportTypes;
        this.getCompanies();
      }
    });
  }

  getCompanies() {
    this.http.get({
      path: `public/companies/`,
      data: {
        order: 'name ASC'
      },
      encode: true,
    }).subscribe((response: any) => {
      this.reportTypes = response.body;
      this.updateBreadcrumbItems();
      this.getReports();
    });
  }

  isMenuActive(item: any) {
    return (item.id === this.reportTypeId) || (item.id === this.companyId);
  }

  getWhere() {
    let where: any = {};

    if (this.reportTypeId) {
      where.reportTypeId = this.reportTypeId;
    } else {
      if (this.subcategoryId) {
        where.reportTypeId = {inq: this.category.childrenMainReportTypes.filter(e => e.subCategory.find(h => h.id === this.subcategoryId)).map(e => e.id)};
      } else {
        where.reportTypeId = {inq: this.category.childrenMainReportTypes.map(e => e.id)};
      }
    }

    if (this.category.code === 'ANLISISDECOMPAAS' && this.companyId) {
      where.companyId = this.companyId;
    }

    if (this.idateStart || this.idateEnd) {
      const conds = [where];

      const start = this.idateStart ? moment(this.idateStart)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate() : '';
      const end = this.idateEnd ? moment(this.idateEnd).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate() : '';

      if (this.idateStart && this.idateEnd) {
        conds.push({
          publishedAt: {
            between: [start, end]
          }
        });
      } else if (this.idateStart) {
        conds.push({ publishedAt: { gte: start } });
      } else if (this.idateEnd) {
        conds.push({ publishedAt: { lte: end } });
      }

      where = {and: conds};
    }
    return where;
  }

  getReportCount() {
    const where = this.getWhere();

    this.http.get({
      path: `public/reports/count`,
      data: where,
      encode: true
    }).subscribe((response: any) => {
      this.totalCount = response.body.count;
      this.totalPages = Math.ceil(this.totalCount / this.ITEMS_PER_PAGE);
      this.pagesItems = [];
      for (let i = 0; i < this.totalPages; i++) {
        this.pagesItems.push(i + 1);
      }
    });
  }

  getReports() {
    const where = this.getWhere();
    const skip = (this.currentPage - 1) * this.ITEMS_PER_PAGE;

    this.http.get({
      path: `public/reports/`,
      data: {
        where,
        fields: ['id', 'name', 'smartContent', 'rTitle', 'publishedAt', 'reportTypeId', 'migrated', 'pdfFile', 'pdfFolder', 'publishedYear'],
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
    }).subscribe((response: any) => {
      this.reports = response.body.map(rep => {
        rep.publishedAt = moment(rep.publishedAt).add(5, 'hours');
        return rep;
      });

      this.getReportCount();
    });
  }

  isANewReport(report: any) {
    const diff = moment().diff(report.publishedAt, 'hours');
    return diff < 24;
  }

  getSubCategoryName() {
    if (this.companyId && this.reportTypes) {
      const company = this.reportTypes.find(e => e.id === this.companyId);
      return company ? company.name : '';
    } else if (this.reportType) {
      if (this.reportType && this.reportType.aliases) {
        const alias = this.reportType.aliases;
        if (alias[this.categoryId]) {
          return alias[this.categoryId];
        }
      }
      return this.reportType.description;
    } else if (this.subcategoryId) {
      const subcat = this.investmentGroups.find(e => e.id === this.subcategoryId);
      return subcat ? subcat.name : '';
    }
    return '';
  }

  getReportSubCategoryName(reportType: any) {
    if (reportType && reportType.aliases) {
      const alias = reportType.aliases;
      if (alias[this.categoryId]) {
        return alias[this.categoryId];
      }
    }
    return reportType.description;
  }

  setCompanyReportType(reportType) {
    this.currentPage = 1;
    this.reportType = reportType;
    this.reportTypeId = reportType.id;
    this.getReports();
  }

  getReportTypeName(reportType: any) {
    if (reportType && reportType.aliases) {
      const alias = reportType.aliases;
      if (alias[this.categoryId]) {
        return alias[this.categoryId];
      }
    }
    return reportType.name ? reportType.name : reportType.description;
  }

  cleanDateFilter() {
    this.input['nativeElement'].value = '';
    this.inputEnd['nativeElement'].value = '';
    this.idateStart = null;
    this.idateEnd = null;
    this.idateLowLimit = null;
    this.idateHighLimit = null;
    this.getReports();
  }

  onBack(event) {
    this.reportTypeId = null;
  }

  setReportType(reportType: any) {
    this.currentPage = 1;
    if (this.category.code === 'ANLISISDECOMPAAS') {
      this.companyId = reportType.id;
    } else {
      this.reportType = reportType;
      this.reportTypeId = reportType.id;
    }

    if (this.companyId) {
      this.router.navigate(['categories', this.categoryId, 'type', this.companyId]);
    } else if (!this.reportTypeId) {
      this.router.navigate(['categories', this.categoryId]);
    } else {
      this.router.navigate(['categories', this.categoryId, 'type', this.reportTypeId]);
    }

    this.updateBreadcrumbItems();
    this.getReports();
  }

  openPdf(report) {
    const url = this.assetBase + `public/assets/reports-migrated/${report.pdfFolder}/${report.publishedYear}/${report.pdfFile}${!report.pdfFile.endsWith('.pdf') ? '.pdf' : ''}`;
    window.open(url, '_blank');
  }

  updateBreadcrumbItems() {
    this.breadcrumbItems = [{
      label: this.category.description,
      link: ['/categories', this.categoryId]
    }];

    if (this.reportType) {
      this.breadcrumbItems.push({
        label: this.reportType.description,
        link: ['/categories', this.categoryId, 'type', this.reportTypeId]
      });
    }

    if (this.companyId) {
      const company = this.reportTypes.find(e => e.id === this.companyId);

      if (!company) {
        return;
      }
      this.breadcrumbItems.push({
        label: company.name,
        link: ['/categories', this.categoryId, 'type', this.companyId]
      });
    }
  }

  pageChanged() {
    this.getReports();
  }

  scroll() {
    window.scrollTo(0, 0);
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
    this.idateLowLimit = moment(this.idateStart)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    this.getReports();
  }

  setEndDate(date) {
    this.idateEnd = date.value;
    this.idateHighLimit = moment(this.idateEnd)
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
    this.getReports();
  }

  tag(eventCategory, eventAction, eventLabel, getUrl) {
    (getUrl) ? eventLabel = window.location.origin + eventLabel : '';
    const gtmTag = {
      eventCategory: eventCategory,
      eventAction: eventAction,
      eventLabel: eventLabel,
      eventvalue: '',
      event: 'eventClick'
    };
    this.gtmService.pushTag(gtmTag);
  }
}
