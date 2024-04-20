import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { BoardService } from './board/board.service';


@Injectable()
export class InterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private _board?: BoardService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this._board.isLoading.next(true);
    return new Observable(observer => {
    const headers = {};

    headers['AuthToken'] = '3wxtSaS0lofZMYHsaZW4SVYxO10EMpVq';
    const dupReq = req.clone({
      setHeaders: headers
    });
    const subscription = next.handle(dupReq)
      .subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        err => { this.removeRequest(req); observer.error(err);  },
        () => { this.removeRequest(req); observer.complete(); });
    // teardown logic in case of cancelled requests
    return () => {
      this.removeRequest(req);
      subscription.unsubscribe();
    };
  });
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);

    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    if (!this.requests.length) {
      this._board.isLoading.next(false);
    }
  }
}

export const HtpInterceptor = [{provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}];
