import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  APP_URL,
  COMMUNICATION_SERVER,
  COMMUNICATION_SERVER_URL,
} from './constants/storage';

@Injectable()
export class AppService {
  messageUrl = 'api/info'; // URL to web api

  constructor(private http: HttpClient) {}

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http.get<any>(this.messageUrl).pipe(
      switchMap(appInfo => {
        return this.http.get<any>(appInfo.authServerURL + '/info').pipe(
          map(authInfo => {
            appInfo.services = authInfo.services;
            appInfo.communication = authInfo.communication;
            return appInfo;
          }),
        );
      }),
    );
  }

  setInfoLocalStorage(response) {
    localStorage.setItem(CLIENT_ID, response.clientId);
    localStorage.setItem(REDIRECT_URI, response.callbackURLs[0]);
    localStorage.setItem(SILENT_REFRESH_REDIRECT_URI, response.callbackURLs[1]);
    localStorage.setItem(LOGIN_URL, response.authorizationURL);
    localStorage.setItem(ISSUER_URL, response.authServerURL);
    localStorage.setItem(APP_URL, response.appURL);

    this.http.get<any>(response.authServerURL + '/info').subscribe({
      next: data => {
        data.services.forEach(element => {
          if (element.type === COMMUNICATION_SERVER) {
            localStorage.setItem(COMMUNICATION_SERVER_URL, element.url);
          }
        });
      },
      error: err => {},
    });
  }
}
