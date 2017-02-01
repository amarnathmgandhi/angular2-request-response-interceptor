'use strict'

import { Utils } from '../../services/utils'
import { Inject, Injectable } from '@angular/core'

@Injectable()
export class APIRequestor {

  private interceptors: any = []
  private authToken: any
  private defaultConfig: any = {}

  // functions that invokes the interceptor's handlers
  private processRequestMiddleware: any = (previousConfig, mware) => mware.request(previousConfig)
  private processResponseMiddleware: any = (previousResponse, mware) => mware.response(previousResponse)
  private processSetAuthTokenMiddleware: any = (previousAuthToken, mware) => mware.setAuthToken(previousAuthToken)

  constructor(
    // requestor mechanism is injected on bootstrap. Default value: Ng2HttpMechanism
    @Inject('RequestorMechanism') private requestorMechanism: any) {
      this.defaultConfig.headers = this.getDefaultHeaders()
  }

  // returns default headers
  private getDefaultHeaders(): any {
    return {
      'Content-Type': 'application/json',
    }
  }

  // registers new interceptors with the api requestor
  public addInterceptor(interceptor: any): void {
    this.interceptors.push(interceptor)
  }

  // reduces the config by passing it through all interceptors' request method
  // and makes the api call using the defined mechanism
  public request(configUrl: any, configObj?: any): any {
    if (!configObj) {
      configObj = {}
    }
    configObj.url = configUrl
    configObj.authToken = this.authToken

    // reduce the config through all interceptors
    let newConfigObj: any = this.interceptors.reduce(this.processRequestMiddleware, Utils.merge(Object.assign({}, this.defaultConfig), configObj))

    // make the api call using the defined mechanism and invoke response
    return this.response(this.requestorMechanism.request(newConfigObj))
  }

  // reduces the response through all interceptors
  private response(response: any): any {
    return this.interceptors.reduce(this.processResponseMiddleware, response)
  }

  // reduces the auth token through all interceptors
  public setAuthToken(tokenValue: any): void {
    this.authToken = this.interceptors.reduce(this.processSetAuthTokenMiddleware, tokenValue)
  }

  public getDefaultConfig(): any {
    return Object.assign({}, this.defaultConfig)
  }

  public setDefaultConfig(config: any): void {
    this.defaultConfig = config
    if (!this.defaultConfig.headers) {
      this.defaultConfig.headers = this.getDefaultHeaders()
    }
  }

  public setMechanism(mechanism: any): void {
    this.requestorMechanism = mechanism
  }
}
