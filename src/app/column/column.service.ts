import {Injectable} from '@angular/core';
// import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import {HttpClientService} from '../httpclient'
import {Column} from '../column/column';
import {Card} from '../card/card';
import { map } from 'rxjs';


@Injectable()
export class ColumnService {
  apiUrl = '/column';

  constructor(private _http: HttpClientService) {
  }

  getAll() {
    // return this._http.get(this.apiUrl)
    //   .map(res => <Column[]>res.json().data);

    return this._http.get(this.apiUrl).pipe(map(res =>{return res}))
  }

  get(id: string) {
    return this._http.get(this.apiUrl + '/' + id).pipe(
      map(res => res));
  }

  getCards(id: string) {
    return this._http.get(this.apiUrl + '/' + id + '/cards').pipe(map(res =>res));
  }

  put(column: Column) {
    return this._http
      .put(this.apiUrl + '/' + column._id, JSON.stringify(column))
      .toPromise();
  }

  post(column: Column) {;
    return this._http.post(this.apiUrl, JSON.stringify(column)).pipe(map(res =>{return res}));
  }

  delete(column: Column) {
    return this._http.delete(this.apiUrl + '/' + column._id)
      .toPromise();

  }

}
