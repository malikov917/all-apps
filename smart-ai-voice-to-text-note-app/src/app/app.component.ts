import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    this.initMediaRecorder();
  }

  initMediaRecorder() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
          this.chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          const li = document.createElement('li');
          const audio = new Audio(audioURL);
          audio.controls = true;
          li.appendChild(audio);
          // @ts-ignore
          document.getElementById('recordingsList').appendChild(li);
        };

        this.mediaRecorder.ondataavailable = (event: any) => {
          // @ts-ignore
          this.chunks.push(event.data);
        };
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
