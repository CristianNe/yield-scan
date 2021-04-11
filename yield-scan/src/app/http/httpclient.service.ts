import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpclientService{

  // REST API endpoints
  aave_endpoint = 'https://aave-api-v2.aave.com'
  aave_poolId = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5'

  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAavePools(): Observable<any>{
    const timestamp = Date.now() / 1000;
    return this.httpClient.get<any>(this.aave_endpoint + '/data/liquidity/v2?poolId=${aave_poolId}&timestamp=${timestamp}')
  }
}
