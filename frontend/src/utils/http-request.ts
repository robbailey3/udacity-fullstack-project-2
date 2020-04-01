import { Observable, Subscriber } from "rxjs";
class HttpClient {
  public get(url: string, options: HttpClientOptions = {}) {
    return new Observable((subscriber: Subscriber) => {
      const xhr = new XMLHttpRequest();
    });
  }
  public post() {}
  public patch() {}
  public put() {}
  public delete() {}
}

interface HttpClientOptions {}
export const http = new HttpClient();
