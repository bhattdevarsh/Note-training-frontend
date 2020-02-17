import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { Note, CreateNote } from 'src/note.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private readonly oauth2: OAuthService,
    private readonly http: HttpClient) { }


  getNoteList() {
    const url = '/api/note/v1/list';
    return this.http
      .get<any>(url, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }


  deleteNote(uuid: string) {
    const url = '/api/note/v1/delete/' + uuid;
    return this.http
      .delete(url, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }

  getOneNote(uuid: string) {
    const url = '/api/note/v1/findnote/' + uuid;
    console.log(url);
    return this.http
      .get<any>(url, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }

  updateNote(note: Note) {
    const url = '/api/note/v1/update';
    return this.http
      .post(url, note, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }

  createNote(note: CreateNote) {
    const url = '/api/note/v1/create';
    return this.http
      .post(url, note, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }

  reject(uuid: string) {
    const url = '/api/note/v1/reverted/' + uuid;
    return this.http
      .get(url, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }

  approve(uuid: string) {
    const url = '/api/note/v1/aproved/' + uuid;
    return this.http
      .get(url, {
        headers: { authorization: this.oauth2.authorizationHeader() },
      })
  }
}
