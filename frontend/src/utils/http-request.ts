import { Observable, Observer } from 'rxjs';
/**
 *
 * A class to handle HTTP Requests.
 * This is just a wrapper to the browser fetch API.
 * Each request returns an RxJS observable.
 * @class HttpClient
 */
class HttpClient {
  public get(url: string, options: Partial<RequestInit> = {}) {
    return this.makeRequest(url, 'GET', null, options);
  }

  public post(url: string, data: any, options: Partial<RequestInit> = {}) {
    return this.makeRequest(url, 'POST', data, options);
  }

  public patch(url: string, data: any, options: Partial<RequestInit> = {}) {
    return this.makeRequest(url, 'POST', data, options);
  }

  public put(url: string, data: any, options: Partial<RequestInit> = {}) {
    return this.makeRequest(url, 'PUT', data, options);
  }

  public delete(url: string, options: Partial<RequestInit> = {}) {
    return this.makeRequest(url, 'DELETE', options);
  }

  // eslint-disable-next-line class-methods-use-this
  private makeRequest(
    url: string,
    method: string,
    data?: any,
    options: Partial<RequestInit> = {}
  ) {
    return new Observable((observer: Observer<any>) => {
      fetch(url, { method, body: data, ...options })
        .then((response: Response) => response.json())
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
          observer.complete();
        });
    });
  }
}
const http = new HttpClient();
export default http;
