import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {

  // REST API endpoints
  aave_endpoint = 'https://aave-api-v2.aave.com'
  aave_poolId = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAavePools(): Observable<any> {
    const timestamp = Date.now() / 1000;
    return this.httpClient.get<any>(this.aave_endpoint +
      '/data/liquidity/v2?poolId=' + this.aave_poolId + '&timestamp=' + timestamp)
      .pipe(
        retry(1),
        catchError(this.processError)
      )
  }

  processError(err) {
    let message = '';
    if(err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(message);
  }

}
