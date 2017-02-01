'use strict'

import { InterceptorInterface } from './interceptorInterface'

export class DefaultInterceptor implements InterceptorInterface {

  constructor() { }

  public request(configObj: any): any {
    const newConfigObj: any = Object.assign({}, configObj)
    // set the request mode
    if (configObj.requestMode) {
      newConfigObj.mode = configObj.requestMode
    }
    if (configObj.authToken && configObj.authToken !== '') {
      newConfigObj.headers['Authorization'] = configObj.authToken
    }
    return newConfigObj
  }

  public setAuthToken(auth: string): string {
    return auth
  }

  public response(responsePromise: any): any {
    return responsePromise
  }
}
