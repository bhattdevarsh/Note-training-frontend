import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../database.service';
import { Note } from 'src/note.interface';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  flag: boolean
  revFlag: boolean
  isProposed: boolean
  noteUuid: string
  note: Note
  title: string
  description: string
  proposedTitle: string
  proposedDescription: string
  proposeNote: { note: Note; proposal: Note }
  noteTitle: string;
  constructor(private readonly activRoute: ActivatedRoute,
    private location: Location,
    private readonly database: DatabaseService,
    private alertCtrl: AlertController, ) {
    this.flag = true
    this.revFlag = false
    this.noteTitle = "Write Note"
  }
  ngOnInit() {
    this.noteUuid = this.activRoute.snapshot.params.uuid
    this.getNote(this.noteUuid)

  }

  getNote(uuid: string) {
    this.database.getOneNote(uuid).subscribe(
      {
        next: response => {

          this.proposeNote = response
          this.writeNotes(this.proposeNote)
        },
        error: async error => {
          let alert = await this.alertCtrl.create({
            message: error.error.message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  this.location.back()
                }
              },
              {
                text: 'Okay',
                handler: () => {
                  this.location.back()
                }
              }
            ]
          });
          alert.present();
        },
      }
    );
  }
  writeNotes(proposeNote) {
    if (proposeNote.proposal) {
      this.proposedTitle = proposeNote.proposal.title
      this.proposedDescription = proposeNote.proposal.description
      this.flag = false
      this.revFlag = false
      this.isProposed = true
      this.noteTitle = "Original Note"
    }
    this.title = proposeNote.note.title
    this.description = proposeNote.note.description
  }


  reject() {
    this.database.reject(this.noteUuid).subscribe(
      {
        next: async response => {
          this.location.back()
        }
      })
  }
  approve() {
    this.database.approve(this.noteUuid).subscribe(
      {
        next: async response => {
          this.location.back()
        }
      })
  }
}
