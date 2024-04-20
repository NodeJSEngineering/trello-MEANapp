import {Injectable} from '@angular/core';
import {Board} from '../board/board';
import { map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClientService } from 'app/httpclient';
// import { HttpClient } from '@angular/common/http';

@Injectable()
// extends ApiService
export class BoardService  {
  apiUrl = '/board';
  boardsCache: Board[] = [];
  refreshcard  = new BehaviorSubject(<string>(''));
  isLoading = new BehaviorSubject(false);

  constructor(public _http: HttpClientService){
    // super(_http)
  }

  // getCards() {
  //   return this.getService('list').pipe(
  //     map((res) => {
  //     return res;
  //    } ));
  // }

  getAll(): any {
    return this._http.get(this.apiUrl).pipe(map((res) => {return res}));
  }

  get(id: string) {
    return this._http.get(this.apiUrl + '/' + id).pipe(map((res) =>{res}));
  }

  getBoardWithColumnsAndCards(id: string){
    return forkJoin(this.get(id), this.getColumns(id), this.getCards(id));
  }

  getColumns(id: string) {
    return this._http.get(this.apiUrl + '/' + id + '/columns').pipe(map((res) => res));
  }

  getCards(id: string) {
    return this._http.get(this.apiUrl + '/' + id + '/cards').pipe(map((res) => res));
  }

  put(board: Board) {
    let body = JSON.stringify(board);
    console.log(body);
    this._http.put(this.apiUrl + '/' + board._id, body)
      .toPromise()
      .then(res => console.log(res));
  }

  post(board: Board) {
    let body = JSON.stringify(board);

    return this._http.post(this.apiUrl, body).pipe(map((res) => res));
  }

  delete(board: Board) {
    this._http.delete(this.apiUrl + '/' + board._id)
      .toPromise()
      .then(res => console.log(res));
  }

}
