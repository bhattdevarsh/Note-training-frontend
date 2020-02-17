import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../database.service';
import { AlertController } from '@ionic/angular';
import { Note, CreateNote } from 'src/note.interface';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.page.html',
  styleUrls: ['./create-new.page.scss'],
})
export class CreateNewPage implements OnInit {

  urlNoteUuid: string
  urlNote: string
  flag: boolean
  isProposed: boolean
  noteUuid: string
  proposeNote: { note: Note; proposal: Note }
  pageTitle: string
  title: string
  description: string
  proposedTitle: string
  proposedDescription: string
  noteCreate: CreateNote
  updateNote: Note
  constructor(
    private readonly activRoute: ActivatedRoute,
    private location: Location,
    private readonly database: DatabaseService,
    private alertCtrl: AlertController,
  ) {
    this.flag = true
    this.noteCreate = {} as CreateNote
    this.noteCreate.title = ""
    this.noteCreate.description = ""
    this.updateNote = {} as Note
    this.updateNote.uuid = ""
    this.updateNote.title = ""
    this.updateNote.description = ""
  }

  ngOnInit() {
    this.urlNoteUuid = this.activRoute.snapshot.params.uuid
    console.log("id" + this.urlNoteUuid);

    this.urlNote = this.activRoute.snapshot.params.note

    if (this.urlNoteUuid === 'note') {
      this.flag = true
      this.pageTitle = "Write Note"
    }
    else {
      this.flag = false
      this.pageTitle = "Edit Note"
      this.getNote(this.urlNoteUuid)
    }
  }


  getNote(uuid: string) {
    this.database.getOneNote(uuid).subscribe(
      {
        next: async response => {
          this.description = response.note.description
          this.title = response.note.title
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

  update() {
    this.updateNote.uuid = this.urlNoteUuid
    this.updateNote.title = this.title
    this.updateNote.description = this.description
    console.log(this.updateNote);

    this.database.updateNote(this.updateNote).subscribe({
      next: res => {
        this.location.back()
      },
      error: async error => {
        console.log("hell" + error);

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
    })
  }


  createNote() {
    this.noteCreate.title = this.title
    this.noteCreate.description = this.description
    this.database.createNote(this.noteCreate).subscribe(
      {
        next: async response => {
          let alert = await this.alertCtrl.create({
            message: "Note Created!",
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
        error: async error => { }
      }
    );
  }
}

