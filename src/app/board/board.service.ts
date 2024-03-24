import {Injectable} from '@angular/core';
// import {Http, Response} from '@angular/http';
// import {Observable} from 'rxjs/Rx';
import {HttpClientService} from '../httpclient';
import {Board} from '../board/board';
import {Column} from '../column/column';
import {Card} from '../card/card';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable()
export class BoardService {
  apiUrl = '/board';
  boardsCache: Board[] = [];

  constructor(private _http: HttpClientService) {
  }

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
