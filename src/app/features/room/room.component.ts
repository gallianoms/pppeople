import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { Observable } from 'rxjs';

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
export class RoomComponent implements OnInit {
  numbers = [1, 2, 3, 5, 8];
  selectedNumber: number | null = null;
  votes: Vote[] = [
    { id: '1', value: 5 },
    { id: '2', value: 3 },
    { id: '3', value: null },
    { id: '4', value: null }
  ];
  state!: RoomConfig;
  copying = false;
  usersConnected$!: Observable<number>;
  usersVoted$!: Observable<number>;

  private location = inject(Location);
  private roomService = inject(RoomService);

  public ngOnInit(): void {
    this.state = this.location.getState() as RoomConfig;
    this.usersConnected$ = this.roomService.getActiveParticipantsCount(this.state.roomId);
    this.usersVoted$ = this.roomService.getVotedParticipantsCount(this.state.roomId);
  }

  onNumberSelect(vote: number): void {
    if (this.selectedNumber === null) this.selectedNumber = vote;
    this.roomService.addVote(this.state.roomId, this.state.userId, vote);
  }

  copyRoomCode() {
    navigator.clipboard.writeText(this.state.roomId);
    this.copying = true;
    setTimeout(() => (this.copying = false), 2000);
  }
}
