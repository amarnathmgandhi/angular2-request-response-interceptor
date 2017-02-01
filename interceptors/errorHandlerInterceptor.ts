'use strict'

import { ErrorCodes } from '../../common/error-codes'
import { InterceptorInterface } from './interceptorInterface'
import { NgRedux, select } from 'ng2-redux'
import { AuthActions } from '../actions'
// Rxjs
import { Observable } from 'rxjs/Observable'
import { RootState } from '../store'

export class ErrorHandlerInterceptor implements InterceptorInterface {

  @select(['auth']) private auth: Observable<any>

  // identifies if a request comes from login or other pages
  private isAuthenticating: boolean = false

  constructor(private ngRedux: NgRedux<RootState>) {
    this.auth.subscribe((auth) => {
        this.isAuthenticating = auth.isAuthenticating
    })
  }

  public request(config: any): any {
    return config
  }

  public setAuthToken(auth: string): string {
    return auth
  }

  public response(responsePromise: any): any {
    return responsePromise
      .then(() => responsePromise)
      .catch((error: any) => {
        // handle special cases
        switch (JSON.stringify(error.status)) {
          case (ErrorCodes.UNAUTHORIZED): {
            if (!this.isAuthenticating) {
              this.ngRedux.dispatch({ type: AuthActions.AUTH_FORCE_LOGIN_USER })
            }
            break
          }
        }

        // reject promise and pass proper error message
        let errorMessage: any = error.statusText
        if (ErrorCodes.getErrorMessage(error.status)) {
          errorMessage = ErrorCodes.getErrorMessage(error.status)
        }
        return Promise.reject(new Error(errorMessage))
      })
  }
}
