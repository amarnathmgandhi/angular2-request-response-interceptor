
// Item Under Test
import { ErrorHandlerInterceptor } from './errorHandlerInterceptor'

// Neccessary Providers
import { NgRedux } from 'ng2-redux'

// Angular Testing
import { describe, expect, it } from '@angular/core/testing'

class MockRedux extends NgRedux<any> {
  constructor() {
    super(null)
  }
  public dispatch: any = jasmine.createSpy('dispatch', () => { })
}

describe('ErrorHandlerInterceptor', () => {

  it('should handle request config', () => {

    let ngRedux: MockRedux = new MockRedux()
    let errorHandlerInterceptor: ErrorHandlerInterceptor = new ErrorHandlerInterceptor(ngRedux)

    const MOCK_CONFIG: any = {
      mode: 'Cors',
    }

    let configResponse: any = errorHandlerInterceptor.request(MOCK_CONFIG)
    expect(configResponse.mode).toEqual('Cors')
  })

  it('should handle auth', () => {

    let ngRedux: MockRedux = new MockRedux()
    let errorHandlerInterceptor: ErrorHandlerInterceptor = new ErrorHandlerInterceptor(ngRedux)

    let authResponse: any = errorHandlerInterceptor.setAuthToken('Test Auth')
    expect(authResponse).toEqual('Test Auth')
  })

  it('should handle errors in response', () => {
    let ngRedux: MockRedux = new MockRedux()
    let errorHandlerInterceptor: ErrorHandlerInterceptor = new ErrorHandlerInterceptor(ngRedux)

    /* tslint:disable:no-unused-variable */
    const MOCK_ERROR_RESPONSE_PROMISE: any = new Promise(function(resolve: any, reject: any): any {
      reject({status: 401, statusText: 'Invalid authentication'})
    })
    /* tslint:enable:no-unused-variable */

    let responsePromise: any = errorHandlerInterceptor.response(MOCK_ERROR_RESPONSE_PROMISE)

    responsePromise
    .then(() => {
      // Interceptor did not catch the error. Force fail test
      expect('Success').toEqual('Error')
    })
    .catch((error: any) => {
        expect(error.message).toEqual('Invalid credentials. Please login again')
        expect(ngRedux.dispatch).toHaveBeenCalled()
    })
  })
})
