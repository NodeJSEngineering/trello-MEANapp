import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Card } from './card';
@Injectable()
// extends ApiService
export class CardService  {
  apiUrl = '/card';

  constructor(public _http: HttpClient) {
    // super(_http)
  }

  // getAllUsers() {
  //   return this.getService('listusers').pipe(map(res => res));
  // }

  // deleteTask(taskId) {
  //   return this.postService('delete', taskId).pipe(
  //     map(res => res));
  // }

  // postCard(card) {
  //   return this.postService('create', (card)).pipe(
  //     map(res => res));
  // }

  // updateCard(card) {
  //   return this.postService('update', (card)).pipe(
  //     map(res => res));
  // }


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
