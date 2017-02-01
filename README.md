# angular2-request-response-interceptor

## Usage

Add interceptors from the parent component

```
private apiRequestor: APIRequestor
....
....
apiRequestor.addInterceptor(new DefaultInterceptor())
apiRequestor.addInterceptor(new ErrorHandlerInterceptor(ngRedux))
```
