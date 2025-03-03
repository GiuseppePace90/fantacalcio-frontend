import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'appFantacalcio';
  message: string = "";

  constructor(private apiService: ApiService) {

  };

  ngOnInit() {
    this.apiService.getMessageHome().subscribe({
      next: (data: any) => this.message = data.text,
      error: (e) => console.log("Si è verificato un errore: ", e)
    });
  };
}
