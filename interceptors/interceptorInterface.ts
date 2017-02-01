export interface InterceptorInterface {
    request(config: any): any
    response(responsePromise: any): any
    setAuthToken(auth: string): string
}
