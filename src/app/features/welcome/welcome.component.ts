import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';
import { RoomManagementService } from '../../core/services/room-management.service';
import { NotificationService } from '../../core/services/notification.service';
import { HelpModalComponent } from '../../shared/components/help-modal/help-modal.component';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule, HelpModalComponent, TablerIconComponent],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  public roomId = '';
  public isSpectator = false;
  public showHelpModal = false;
  public estimationType: 'fibonacci' | 't-shirt' = 'fibonacci';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roomManagementService = inject(RoomManagementService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    // Check if there's a room ID in the query parameters
    this.route.queryParams.subscribe(params => {
      if (params['roomId']) {
        this.roomId = params['roomId'];
        this.joinRoom();
      }
    });
  }

  public async createRoom() {
    const { roomId, hostId } = await this.roomManagementService.createRoom(this.estimationType);

    this.navigateToRoom({
      roomId,
      userId: hostId,
      isHost: true,
      isSpectator: false,
      estimationType: this.estimationType
    });
  }

  public async joinRoom() {
    if (!this.roomId?.trim()) {
      this.notificationService.showError('Please enter a room code');
      return;
    }

    try {
      const { userId, estimationType } = await this.roomManagementService.joinRoom(this.roomId, this.isSpectator);

      this.navigateToRoom({
        roomId: this.roomId,
        userId,
        isHost: false,
        isSpectator: this.isSpectator,
        estimationType
      });
    } catch (error) {
      this.notificationService.showError(
        error instanceof Error
          ? `The table is currently unavailable. ${error.message}`
          : 'The table is not ready for new players at the moment'
      );
    }
  }

  private navigateToRoom(config: RoomConfig): void {
    this.router.navigate(['/room/' + config.roomId], { state: config });
  }
}
