import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import lodash from 'lodash';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
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
  public totalPages: number;
  public currentPage = 1;
  readonly ITEMS_PER_PAGE = 6;

  public breadcrumbItems: Array<any> = [];

  public assetBase: string = environment.URL_API;

  public idateStart: any;
  public idateEnd: any;

  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    reportTypes: []
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    reportTypes: []
  }, {
    name: 'Monedas',
    code: 'DIVISAS',
    reportTypes: []
  }];

  constructor(private http: HttpService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      if (params.get('id')) {
        this.categoryId = params.get('id');
      }

      if (params.get('typeid')) {
        this.reportTypeId = params.get('typeid');
      }

      if (this.categoryId) {
        this.getCategory();
      }
    });
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
      where.reportTypeId = {inq: this.category.childrenMainReportTypes.map(e => e.id)};
    }

    if (this.category.code === 'ANLISISDECOMPAAS' && this.companyId) {
      where.companyId = this.companyId;
    }

    if (this.idateStart || this.idateEnd) {
      const conds = [where];

      if (this.idateStart) {
        const start = moment(this.idateStart).add(5, 'hours').toDate();
        conds.push({publishedAt: {gte: start}});
      }

      if (this.idateEnd) {
        const end = moment(this.idateEnd).add(5, 'hours').toDate();
        if (lodash.get(conds, '[1].publishedAt')) {
          lodash.merge(conds[1].publishedAt, {lte: end});
        } else {
          conds.push({publishedAt: {lte: end}});
        }
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
    }).subscribe((response: any) => {
      this.reports = response.body;

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
      return this.reportType.description;
    }
    return '';
  }

  getReportSubCategoryName(reportType: any) {
    const name = reportType.description;
    return name;
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
    return reportType.name;
  }

  setReportType(reportType: any) {
    this.currentPage = 1;
    if (this.category.code === 'ANLISISDECOMPAAS') {
      this.companyId = reportType.id;
    } else {
      this.reportType = reportType;
      this.reportTypeId = reportType.id;
    }
    this.updateBreadcrumbItems();
    this.getReports();
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

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.getReports();
  }

  previousPage() {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.getReports();
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
