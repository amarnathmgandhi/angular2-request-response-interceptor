// Item Under Test
import { APIRequestor } from './api-requestor'

// Angular Testing
import { beforeEachProviders, describe, expect, it, inject, async } from '@angular/core/testing'
import { provide } from '@angular/core'

let MOCK_REQUESTOR_MECHANISM: any = {
  request: config => config,
}

describe('APIRequestorFactory config', () => {

  beforeEachProviders(() => [ APIRequestor,
    provide('RequestorMechanism', MOCK_REQUESTOR_MECHANISM),
  ])

  it('should be settable and gettable', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {

    const DEFAULT_CONFIG: any = {
      requestMode: 'cors',
    }

    apiRequestor.setDefaultConfig(DEFAULT_CONFIG)
    expect(apiRequestor.getDefaultConfig()).toEqual({
      // default headers from apiRequestor
      headers: {
        'Content-Type': 'application/json',
      },
      requestMode: 'cors',
    })
  })))

  it('should be used in all subsequent requests', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {
    let myUrl: string
    let myConfig: any
    const MOCK_MECHANISM: any = {
      request: (config) => {
      myUrl = config.url
      myConfig = config
    }}

    const MOCK_URL: string = 'https://test.techradar.odecee/'
    const MOCK_CONFIG: any = {
      headers: { key: 'val' },
    }

    const MOCK_DEFAULT_CONFIG: any = {
      headers: {
        'Authorization': 'mock authorization',
      },
    }

    apiRequestor.setDefaultConfig(MOCK_DEFAULT_CONFIG)
    apiRequestor.setMechanism(MOCK_MECHANISM)
    apiRequestor.request(MOCK_URL, MOCK_CONFIG)

    expect(myConfig.headers).toEqual({
      'Authorization': 'mock authorization',
      key: 'val',
    })

    expect(myConfig.url).toEqual('https://test.techradar.odecee/')

  })))
})

describe('APIRequestorFactory auth', () => {

  beforeEachProviders(() => [ APIRequestor,
    provide('RequestorMechanism', MOCK_REQUESTOR_MECHANISM),
  ])

  it('should be settable', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {
    let myAuth: string
    const MOCK_AUTH: string = '1234'
    const MOCK_MECHANISM: any = {
      request: (config) => {
      myAuth = config.authToken
    }}

    const MOCK_URL: string = 'https://test.techradar.odecee/'
    const MOCK_CONFIG: any = {}

    apiRequestor.setAuthToken(MOCK_AUTH)
    apiRequestor.setMechanism(MOCK_MECHANISM)
    apiRequestor.request(MOCK_URL, MOCK_CONFIG)

    expect(myAuth).toEqual('1234')
  })))
})

describe('APIRequestor request', () => {

  beforeEachProviders(() => [ APIRequestor,
    provide('RequestorMechanism', MOCK_REQUESTOR_MECHANISM),
  ])

  it('should have a request function', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {
    expect(typeof apiRequestor.request).toEqual('function')
  })))

  it('should execute the custom mechanism on api request', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {
    let myUrl: string
    let myConfig: any
    const MOCK_MECHANISM: any = {
      request: (config) => {
      myUrl = config.url
      myConfig = config
    }}

    const MOCK_URL: string = 'https://test.techradar.odecee/'
    const MOCK_CONFIG: any = {
      requestMode: 'cors',
    }

    const MOCK_DEFAULT_CONFIG: any = {
      headers: {
        'Authorization': 'mock authorization',
      },
    }

    apiRequestor.setDefaultConfig(MOCK_DEFAULT_CONFIG)
    apiRequestor.setMechanism(MOCK_MECHANISM)
    apiRequestor.request(MOCK_URL, MOCK_CONFIG)

    expect(myConfig.headers).toEqual({
      'Authorization': 'mock authorization',
    })

    expect(myConfig.url).toEqual('https://test.techradar.odecee/')
    expect(myConfig.requestMode).toEqual('cors')

  })))
})

describe('APIRequestor Interceptors', () => {

  beforeEachProviders(() => [ APIRequestor,
    provide('RequestorMechanism', MOCK_REQUESTOR_MECHANISM),
  ])

  it('should add new interceptor', async(inject([APIRequestor], (apiRequestor: APIRequestor) => {

    const MOCK_INTERCEPTOR: any = {
      request: configObj => configObj,
      response: () => 'Test Response',
      setAuthToken: token => token,   // Set the token
    }

    const MOCK_MECHANISM: any = {
      request: (config) => config,
    }

    const MOCK_URL: string = 'https://test.techradar.odecee/'

    const MOCK_DEFAULT_CONFIG: any = {
      headers: {
        'Authorization': 'mock authorization',
      },
    }
    apiRequestor.addInterceptor(MOCK_INTERCEPTOR)
    apiRequestor.setDefaultConfig(MOCK_DEFAULT_CONFIG)
    apiRequestor.setMechanism(MOCK_MECHANISM)
    let response: any = apiRequestor.request(MOCK_URL)

    expect(response).toEqual('Test Response')

  })))
})
