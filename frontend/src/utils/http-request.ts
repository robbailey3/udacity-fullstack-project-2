import { Observable, Observer } from "rxjs";

class HttpClient {
  public get(url: string, options: HttpClientOptions = {}) {
    return new Observable((observer: Observer<any>) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = () => {
        if (xhr.status === 200) {
          observer.next(xhr.response);
        } else {
        }
      };
    });
  }
  public post() {}
  public patch() {}
  public put() {}
  public delete() {}
}

interface HttpClientOptions {}
export const http = new HttpClient();
