import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public _http: HttpClient) { }

  base_uri = 'https://devza.com/tests/tasks/';

  getService(url: string) {
    return this._http.get<any[]>(this.base_uri + url).pipe(
      map(res => {
        return res;
      })
    );
  }

  // FOR ALL POST SERVICE
  postService(url: string, data: any) {
    return this._http.post(this.base_uri + url, data).pipe(
      map(res => {
        return res;
      })
    );
  }

  public handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error['error']['message']);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    console.log(error);
    switch (error.error.type) {
      case 'INTERNAL_SERVER_ERROR':
      case 'FORBIDDEN_ERROR':
      case 'INVALID_CREDENTIALS':
      case 'BUSINESS_LOGIC_ERROR':
      case 'RESOURCE_NOT_FOUND':

        return throwError(error.error.error);
      case 'VALIDATION':

    }
    return throwError(error);
  }

}
