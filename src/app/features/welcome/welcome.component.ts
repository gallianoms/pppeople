import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  public roomCode = '';
  public isSpectator = false;

  private router = inject(Router);

  public createRoom() {
    const generateId = crypto.randomUUID();
    this.router.navigate(['/room/' + generateId]);
  }

  public joinRoom() {
    if (this.checkRoomExists(this.roomCode)) {
      this.router.navigate(['/room/' + this.roomCode]);
    } else {
      alert('No valide room code');
    }
  }

  private checkRoomExists(roomCode: string): boolean {
    return false;
  }
}
