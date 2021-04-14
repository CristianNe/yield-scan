import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {

  // REST API endpoints
  aave_endpoint = 'https://aave-api-v2.aave.com';
  yearn_endpoint = 'https://dev-api.yearn.tools';
  compound_endpoint = 'https://api.compound.finance/api/v2';

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAavePools(): Observable<any> {
    // ToDO: find out about correct timestamp generation / permissible timestamps
    const timestamp = 1612997018; //~~(Date.now() / 1000);
    const aave_poolId = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5';
    return this.httpClient.get(this.aave_endpoint +
      '/data/liquidity/v2?poolId=' + aave_poolId + '&timestamp=' + timestamp,
      {headers: this.httpHeader.headers }
    )
      .pipe(
        retry(1),
        catchError(this.processError)
      )
  }

  // ToDO
  getCompoundPools(): Observable<any> {
    // ToDO: find out about correct timestamp generation / permissible timestamps
    return this.httpClient.get(this.compound_endpoint + '/ctoken',
      {headers: this.httpHeader.headers }
    )
      .pipe(
        retry(1),
        catchError(this.processError)
      )
  }

  getYearnVaults(): Observable<any> {
    // ToDO: find out about correct timestamp generation / permissible timestamps
    return this.httpClient.get(this.yearn_endpoint + '/vaults/apy',
      {headers: this.httpHeader.headers }
    )
      .pipe(
        retry(1),
        catchError(this.processError)
      )
  }

  processError(err: any) {
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
