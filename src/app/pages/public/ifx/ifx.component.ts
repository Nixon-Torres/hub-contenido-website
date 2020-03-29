import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-book',
    templateUrl: './ifx.component.html',
    styleUrls: ['./ifx.component.scss']
})
export class IfxComponent implements OnInit {
    constructor(private httpService: HttpService) {
    }

    ngOnInit() {
    }
}
