// Item Under Test
import { Ng2HttpMechanism } from './ng2-http-mechanism'

// Neccessary Providers
import { Response, Http, ResponseOptions, BaseRequestOptions, Headers,  RequestOptions } from '@angular/http'

// Angular Testing
import { describe, expect, it, inject, async, addProviders } from '@angular/core/testing'
import { MockBackend, MockConnection } from '@angular/http/testing'
import { provide } from '@angular/core'

// Observable.toPromise() used in Ng2HttpMechanism does not work ONLY when in unit test mode! :/
// importing 'toPromise' fixes it!!
import 'rxjs/add/operator/toPromise'

describe('Ng2HttpMechanism request', () => {

  beforeEach(() => addProviders([
    Ng2HttpMechanism,
    BaseRequestOptions,
    MockBackend,
    provide(RequestOptions, { useClass: BaseRequestOptions }),
    provide(Http, {
      useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
        return new Http(backend, defaultOptions)
      },
      deps: [MockBackend, BaseRequestOptions],
    }),
  ]))

  it('should make a http request', async(inject([Ng2HttpMechanism, MockBackend, Http], (ng2HttpMechanism: Ng2HttpMechanism, mockBackend: MockBackend) => {
    let connection: MockConnection

    mockBackend.connections.subscribe(c => connection = c)
    let testResponse: any = {
      data: 'Success',
    }
    ng2HttpMechanism.request({ url: '/test', headers: {} }).then(data => {
      expect(data).toEqual(testResponse)
    })
    connection.mockRespond(new Response(new ResponseOptions({ body: testResponse })))
  })))

  it('should convert map to Headers', async(inject([Ng2HttpMechanism, MockBackend, Http], (ng2HttpMechanism: Ng2HttpMechanism, mockBackend: MockBackend) => {
    let connection: MockConnection

    const MOCK_CONFIG: any = {
      url: '/test',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    let HEADERS_OUTPUT: Headers = new Headers()
    HEADERS_OUTPUT.append('Content-Type', 'application/json')

    mockBackend.connections.subscribe(c => connection = c)
    let testResponse: any = {
      data: 'Success',
    }
    ng2HttpMechanism.request(MOCK_CONFIG).then(data => {
      expect(data).toEqual(testResponse)
      expect(MOCK_CONFIG.headers.get('Content-Type')).toEqual(HEADERS_OUTPUT.get('Content-Type'))
    })
    connection.mockRespond(new Response(new ResponseOptions({ body: testResponse })))
  })))
})
