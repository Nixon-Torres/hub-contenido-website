import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  public numPages = 0;
  public currentPdfPage = 1;
  public bookPreviewPdfSrc = '';

  public subscriber: any = {};
  public subscribeGroup: FormGroup;
  public submitted = false;
  public content: any;
  public data: any;
  public STORAGE_URL = environment.URL_API;
  public maxBooks = 3;

  public booksContent: any;
  public books: any;
  public breadcrumbItems: Array<any> = [{
    label: 'Estar actualizado',
    link: ['/categories', '5e7fc9a5dc4b4a6c6629517e']
  }];

  constructor(private http: HttpService, private router: Router) {
    this.subscribeGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      knowledge: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      accept: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      subscribe: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getContent();
    this.getBooksContent();
  }

  getBooksContent() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'thebookVersionsKey'
        },
        include: ['files']
      },
      encode: true
    }).subscribe((res) => {
      if (res && res.body && (res.body as any).length) {
        this.booksContent = res.body[0];
        this.books = this.booksContent.books;

        this.books = this.books.map((book) => {
          const blocks = this.booksContent.blocks.filter(e => e.bookId === book.id);
          const title = blocks.find(e => e.id && e.id.indexOf('title') > -1);
          const year = blocks.find(e => e.id && e.id.indexOf('year') > -1);
          const pdf = this.booksContent.files.find(e => e.key === 'blockImage-book-' + book.id);
          const thumbnail = this.booksContent.files.find(e => e.key === 'blockImage-thumbnail-' + book.id);

          if (thumbnail) {
            thumbnail.assetUrl = this.STORAGE_URL + thumbnail.clientPath;
          }

          if (pdf) {
            pdf.assetUrl = this.STORAGE_URL + pdf.clientPath;
          }

          book.title = title.content;
          book.year = year.content;
          book.pdf = pdf;
          book.thumbnail = thumbnail;
          return book;
        }).sort((a, b) => {
          if (!a || !b) {
            return 0;
          }

          if (parseInt(a.year, 10) >  parseInt(b.year, 10)) {
            return -1;
          } else if (parseInt(a.year, 10) < parseInt(b.year, 10)) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    });
  }

  getContent() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'thebookKey'
        },
        include: ['files']
      },
      encode: true
    }).subscribe((res) => {
      if (res && res.body && (res.body as any).length) {
        this.content = res.body[0];
        this.data = {};
        this.content.blocks.forEach((e) => {
          this.data[e.id] = e.content;
        });

        this.content.blocks.forEach((e) => {
          const image = this.content.files.find(j => j.key === 'blockImage-' + e.id);
          if (image) {
            image.assetUrl = this.STORAGE_URL + image.clientPath;
            this.data[e.id] = image;
          }
        });

        if (this.data.pdfPreviewSrc) {
          this.bookPreviewPdfSrc = this.data.pdfPreviewSrc.assetUrl;
        }
      }
    });
  }

  callBackFn(pdf: any) {
    this.numPages = pdf.numPages;
  }

  subscribe() {
    if (this.subscribeGroup.status === 'INVALID') {
      console.log('invalid!');
      return;
    }

    this.submitted = true;
    this.http.post({
      path: 'public/subscribe/thebook',
      data: {
        subscriber: this.subscriber
      }
    }).subscribe((res) => {
      this.router.navigate(['/thankyou']);
    });
  }
}
