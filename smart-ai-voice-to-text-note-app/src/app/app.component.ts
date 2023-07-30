import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from './ai.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  text = signal('text')
  isRecording = signal(false);
  chunks = [];
  mediaRecorder: any;
  aiService = inject(AiService);

  ngOnInit() {
    this.initMediaRecorder();
  }

  initMediaRecorder() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { 'type' : 'audio/webm' });
          const audioURL = window.URL.createObjectURL(blob);
          this.addAudioChunk(audioURL);
          this.sendAudioToServer(blob);
        };

        this.mediaRecorder.ondataavailable = (event: any) => {
          // @ts-ignore
          this.chunks.push(event.data);
          console.log('event data', event.data);
          console.log('chunks', this.chunks);
        };
      });
  }

  addAudioChunk(audioURL: string) {
    const li = document.createElement('li');
    const audio = new Audio(audioURL);
    audio.controls = true;
    li.appendChild(audio);
    // @ts-ignore
    document.getElementById('recordingsList').appendChild(li);
  }

  sendAudioToServer(blob: any) {
    const formData = new FormData();
    formData.append('audio', blob);
    this.aiService.sendAudioToServer(formData).subscribe((res: any) => {
      console.log('res', res);
      this.text.set(res.text);
    });
  }

  toggleRecording() {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.isRecording.set(true);
    this.mediaRecorder.start();

  }

  stopRecording() {
    this.isRecording.set(false);
    this.mediaRecorder.stop();
  }
}
