import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private http: HttpClient) { }

  sendAudioToServer(audio: any): Observable<any> {
    return this.http.post('/ai/voice-to-text/audio', audio);
  }
}
