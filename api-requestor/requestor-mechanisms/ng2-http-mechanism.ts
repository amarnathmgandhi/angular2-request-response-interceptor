'use strict'

import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Request } from '@angular/http'

// mechanism that uses http to make api calls
@Injectable()
export class Ng2HttpMechanism {

  constructor(private http: Http, private defaultRequestOptions: RequestOptions) {}

  private convertMapToHeaders(headersMap: any): any {
    let headers: Headers = new Headers()
    Object.keys(headersMap).forEach((headerKey) => {
      headers.append(headerKey, headersMap[headerKey])
    })
    return headers
  }

  // request should always return a promise
  public request: any = (configObj: any) => {
    configObj.headers = this.convertMapToHeaders(configObj.headers)

    // merge the default RequestOptions with the request config
    let requestOptions: RequestOptions = this.defaultRequestOptions.merge(configObj)
    return this.http.request(new Request(requestOptions)).map(res => res.json()).toPromise()
  }

  // sample mechanism for fetch api
  /* private request: any = (configObj: any) => {
    const newConfigObj: any = Object.assign({}, configObj)
    // Convert to Fetch API Header format
    newConfigObj.headers = new Headers(newConfigObj.headers)
    return this.response(window.fetch(newConfigObj.url, newConfigObj).then(response => response.json()))
  } */

}
