import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Vote {
  id: string;
  value: number | null;
}

@Component({
  selector: 'app-room',
  imports: [CommonModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {
  numbers = [1, 2, 3, 5, 8];
  selectedNumber: number | null = null;
  votes: Vote[] = [
    { id: '1', value: 5 },
    { id: '2', value: 3 },
    { id: '3', value: null },
    { id: '4', value: null }
  ];

  onNumberSelect(number: number): void {
    this.selectedNumber = number;
    console.log('Selected number:', number);
  }

  copyRoomCode() {
    navigator.clipboard.writeText('a60a1ce8-22eb-44b7-8959-db7ace0cc29c');
    // Opcional: añadir algún tipo de feedback visual
  }
}
