import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private socket!: WebSocket;
  private messageSubject = new Subject<string>(); // Per gestire i messaggi ricevuti

  constructor(private http: HttpClient) {

  };

  getMessageHome(): Observable<any> {
    return this.http.get<any>(environment.base_url + '/');
  }

  getVoti(): Observable<any> {
    return this.http.get<any>(environment.base_url + '/api/voti');
  }

  downloadFile(): Observable<any> {
    return this.http.get<any>(environment.base_url + '/download');
  }

  wsConnect() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket('ws://localhost:4040'); // URL del WebSocket backend

      this.socket.onopen = () => {
        console.log('WebSocket connesso');
      };

      this.socket.onmessage = (event) => {
        console.log('Messaggio ricevuto dal WebSocket:', event.data);
        this.messageSubject.next(event.data); // Invia il messaggio agli osservatori
      };

      this.socket.onerror = (error) => {
        console.error('Errore WebSocket:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnesso');
        setTimeout(() => this.wsConnect(), 5000); // Tentativo di riconnessione dopo 5 secondi
      };
    }
  }

  /**
   * Invia un messaggio al WebSocket
   */
  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket non connesso, impossibile inviare messaggi.');
    }
  }

  /**
   * Ottiene gli aggiornamenti dei messaggi WebSocket
   */
  getWebSocketMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
