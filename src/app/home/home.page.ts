import { Component, OnInit } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { DatabaseService } from '../database.service';
import { Note } from 'src/note.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loggedIn: boolean;
  accessToken: string;
  note: Array<Note>
  constructor(
    private readonly oauth2: OAuthService,
    private readonly database: DatabaseService,
    private alertCtrl: AlertController,
    //private location: Location, 
  ) { }

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
    this.getNoteList()
  }

  getNoteList() {
    this.database.getNoteList()
      .subscribe({
        next: response => {

          this.note = response

        },
        error: error => { },
      });
  }


  async deleteStudent(index: number) {
    let alert = await this.alertCtrl.create({
      message: "Hey! You sure You Want to delete " + this.note[index].title + " Note ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.database.deleteNote(this.note[index].uuid)
              .subscribe({
                next: response => {
                  this.getNoteList()
                },
                error: error => { },
              });
          }
        }
      ]
    });
    alert.present();
  }

}
