import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';
import { RoomManagementService } from '../../core/services/room-management.service';
import { HelpModalComponent } from '../../shared/components/help-modal/help-modal.component';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule, HelpModalComponent, TablerIconComponent],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  public showHelpModal = false;
  public estimationType: 'fibonacci' | 't-shirt' = 'fibonacci';

  private router = inject(Router);
  private roomManagementService = inject(RoomManagementService);

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

  private navigateToRoom(config: RoomConfig): void {
    this.router.navigate(['/room/' + config.roomId], { state: config });
  }
}
