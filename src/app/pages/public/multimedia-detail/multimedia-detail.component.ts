import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-multimedia-detail',
    templateUrl: './multimedia-detail.component.html',
    styleUrls: ['./multimedia-detail.component.scss']
})
export class MultimediaDetailComponent implements OnInit {
    constructor(private httpService: HttpService) {
    }

    ngOnInit() {
    }
}
