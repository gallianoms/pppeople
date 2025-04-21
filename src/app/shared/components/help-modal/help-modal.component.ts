import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';

interface HelpItem {
  icon: string;
  title: string;
  description: string;
  list?: { text: string }[];
}

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [TablerIconComponent],
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();

  helpItems: HelpItem[] = [
    {
      icon: 'plus',
      title: 'Creating a Room',
      description:
        'Start your planning session by clicking "Create Room". As the host, you\'ll have full control over the session.'
    },
    {
      icon: 'user-plus',
      title: 'Joining a Room',
      description: 'Enter the room code and select your role:',
      list: [
        { text: 'Player: Actively participate in voting' },
        { text: 'Spectator: Observe the session without voting' }
      ]
    },
    {
      icon: 'check',
      title: 'Voting & Results',
      description:
        'Choose your estimate by selecting a card. Once everyone votes, cards are revealed and the average score is calculated automatically.'
    }
  ];

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close.emit();
  }

  @HostListener('click', ['$event'])
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close.emit();
    }
  }
}
