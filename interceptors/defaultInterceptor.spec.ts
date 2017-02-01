
// Item Under Test
import { DefaultInterceptor } from './defaultInterceptor'

// Angular Testing
import { describe, expect, it } from '@angular/core/testing'

describe('DefaultInterceptor', () => {

  it('should handle request config with auth token and request mode', () => {

    let defaultInterceptor: DefaultInterceptor = new DefaultInterceptor()

    const MOCK_CONFIG: any = {
      requestMode: 'cors',
      authToken: 'Test Auth',
      headers: {},
    }

    let configResponse: any = defaultInterceptor.request(MOCK_CONFIG)
    expect(configResponse.mode).toEqual('cors')
    expect(configResponse.headers['Authorization']).toEqual('Test Auth')
  })

  it('should handle request config without auth token and request mode', () => {

    let defaultInterceptor: DefaultInterceptor = new DefaultInterceptor()

    const MOCK_CONFIG: any = {
      headers: {},
    }

    let configResponse: any = defaultInterceptor.request(MOCK_CONFIG)
    expect(configResponse.mode).toBeUndefined()
    expect(configResponse.headers['Authorization']).toBeUndefined()
  })

  it('should handle auth', () => {

    let defaultInterceptor: DefaultInterceptor = new DefaultInterceptor()

    let authResponse: any = defaultInterceptor.setAuthToken('Test Auth')
    expect(authResponse).toEqual('Test Auth')
  })

  it('should handle response', () => {

    let defaultInterceptor: DefaultInterceptor = new DefaultInterceptor()
    const MOCK_ERROR_RESPONSE: string = 'Success'

    let response: any = defaultInterceptor.response(MOCK_ERROR_RESPONSE)
    expect(response).toEqual('Success')
  })
})
