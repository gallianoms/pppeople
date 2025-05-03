import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseConnectionService } from './firebase-connection.service';
import { RoomManagementService, CreateRoomResponse, JoinRoomResponse } from './room-management.service';
import { ParticipantService } from './participant.service';
import { VotingService } from './voting.service';
import { RoomAuthorizationService } from './room-authorization.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(
    private firebaseService: FirebaseConnectionService,
    private roomManagementService: RoomManagementService,
    private participantService: ParticipantService,
    private votingService: VotingService,
    private authService: RoomAuthorizationService
  ) {}

  // Room Management
  public async createRoom(estimationType: 'fibonacci' | 't-shirt' = 'fibonacci'): Promise<CreateRoomResponse> {
    return this.roomManagementService.createRoom(estimationType);
  }

  public async joinRoom(roomId: string, isSpectator = false): Promise<JoinRoomResponse> {
    return this.roomManagementService.joinRoom(roomId, isSpectator);
  }

  public async deleteRoom(roomId: string, userId: string): Promise<void> {
    return this.roomManagementService.deleteRoom(roomId, userId);
  }

  public listenToRoomDeletion(roomId: string): Observable<void> {
    return this.roomManagementService.listenToRoomDeletion(roomId);
  }

  public async getRoomEstimationType(roomId: string): Promise<'fibonacci' | 't-shirt'> {
    return this.roomManagementService.getRoomEstimationType(roomId);
  }

  // Participant Management
  public getActiveParticipantsCount(roomId: string): Observable<number> {
    return this.participantService.getActiveParticipantsCount(roomId);
  }

  public async removeParticipant(roomId: string, userId: string): Promise<void> {
    return this.participantService.removeParticipant(roomId, userId);
  }

  // Voting
  public async addVote(roomId: string, userId: string, vote: number): Promise<void> {
    return this.votingService.addVote(roomId, userId, vote);
  }

  public async removeVote(roomId: string, userId: string): Promise<void> {
    return this.votingService.removeVote(roomId, userId);
  }

  public getVotedParticipantsCount(roomId: string): Observable<number> {
    return this.votingService.getVotedParticipantsCount(roomId);
  }

  public getVotes(roomId: string): Observable<number[]> {
    return this.votingService.getVotes(roomId);
  }

  public calcAverageVote(roomId: string): Observable<number> {
    return this.votingService.calcAverageVote(roomId);
  }

  public async resetVotes(roomId: string, userId: string): Promise<void> {
    return this.votingService.resetVotes(roomId, userId);
  }

  public getUserVote(roomId: string, userId: string): Observable<number | null> {
    return this.votingService.getUserVote(roomId, userId);
  }

  // Authorization
  public async checkRoomExists(roomId: string): Promise<boolean> {
    return this.authService.checkRoomExists(roomId);
  }

  public async hasUserVoted(roomId: string, userId: string): Promise<boolean> {
    return this.authService.hasUserVoted(roomId, userId);
  }

  public async checkIsHost(roomId: string, userId: string): Promise<boolean> {
    return this.authService.checkIsHost(roomId, userId);
  }

  // Path Helpers (for compatibility)
  public getRoomPath(roomId: string): string {
    return this.firebaseService.getRoomPath(roomId);
  }

  public getParticipantsPath(roomId: string): string {
    return this.firebaseService.getParticipantsPath(roomId);
  }

  public getParticipantPath(roomId: string, userId: string): string {
    return this.firebaseService.getParticipantPath(roomId, userId);
  }

  public getVotePath(roomId: string, userId: string): string {
    return this.firebaseService.getVotePath(roomId, userId);
  }
}
