import { Component, OnInit, isDevMode } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  SCOPE,
} from './constants/storage';
import { AppService } from './app.service';
import {
  OAuthService,
  AuthConfig,
  JwksValidationHandler,
  OAuthEvent,
} from 'angular-oauth2-oidc';
import { IDTokenClaims } from './common/interfaces/id-token-claims.interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  hideAuthButtons: boolean = false;
  accessToken: string;
  picture: string;
  email: string;
  name: string;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
      //color: "primary"
    },
    {
      title: 'Create New',
      url: '/create-new/note',
      icon: 'person-add',
      //color: ""
    }
  ];


  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly appService: AppService,
    private readonly oauth2: OAuthService,
    private readonly http: HttpClient,
  ) {
    this.setupOIDC();
    this.initializeApp();
  }

  ngOnInit() {
    this.oauth2.events.subscribe(({ type }: OAuthEvent) => {
      // Silent Refresh
      switch (type) {
        case 'token_received':
          this.setUserSession();
          break;
        case 'logout':
          this.setUserSession();
          break;
      }
    });

    this.setUserSession();

  }

  setUserSession() {
    this.loggedIn = this.oauth2.hasValidAccessToken();
    this.accessToken = this.oauth2.getAccessToken();
    if (this.loggedIn) {
      const url = localStorage.getItem(ISSUER_URL) + '/oauth2/profile';
      this.http
        .get<IDTokenClaims>(url, {
          headers: { authorization: this.oauth2.authorizationHeader() },
        })
        .subscribe({
          next: response => {
            this.picture = response.picture;
            this.name = response.name;
            this.email = response.email;
            console.log(this.picture);

          },
          error: error => { },
        });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  login() {
    this.oauth2.initLoginFlow();
  }

  logout() {
    this.oauth2.logOut();
    this.loggedIn = false;
  }
  // clickMenu(index: number) {
  //   for (let i = 0; i < this.appPages.length; i++) {
  //     if (i === index) {
  //       this.appPages[i].color = "primary"
  //     }
  //     else {
  //       this.appPages[i].color = ""
  //     }
  //   }
  // }

  setupOIDC(): void {
    this.appService.getMessage().subscribe(response => {
      if (response.message) return; // { message: PLEASE_RUN_SETUP }
      this.appService.setInfoLocalStorage(response);
      const authConfig: AuthConfig = {
        clientId: localStorage.getItem(CLIENT_ID),
        redirectUri: localStorage.getItem(REDIRECT_URI),
        silentRefreshRedirectUri: localStorage.getItem(
          SILENT_REFRESH_REDIRECT_URI,
        ),
        loginUrl: localStorage.getItem(LOGIN_URL),
        scope: SCOPE,
        issuer: localStorage.getItem(ISSUER_URL),
        disableAtHashCheck: true,
        customQueryParams: { prompt: 'select_account' },
      };
      if (isDevMode()) authConfig.requireHttps = false;
      this.oauth2.configure(authConfig);
      this.oauth2.tokenValidationHandler = new JwksValidationHandler();
      this.oauth2.setupAutomaticSilentRefresh();
      this.oauth2.loadDiscoveryDocumentAndTryLogin();
    });
  }
}
