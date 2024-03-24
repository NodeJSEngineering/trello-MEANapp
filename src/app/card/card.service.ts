import {Injectable} from '@angular/core';
// import {Http} from '@angular/http';
import {HttpClientService} from '../httpclient';
import {Card} from '../card/card';
import { map } from 'rxjs';

@Injectable()
export class CardService {
  apiUrl = '/card';

  constructor(private _http: HttpClientService) {
  }

  getAll() {
    return this._http.get(this.apiUrl).pipe(map(res => {return res}));
  }

  get(id: string) {
    return this._http.get(this.apiUrl + '/' + id).pipe(map(res => res));
  }

  put(card: Card) {
    return this._http.put(this.apiUrl + '/' + card._id, JSON.stringify(card))
      .toPromise();
  }

  post(card: Card) {
    return this._http.post(this.apiUrl, JSON.stringify(card)).pipe(map(res => res));
  }

  delete(card: Card) {
    return this._http.delete(this.apiUrl + '/' + card._id)
      .toPromise();
  }

}
