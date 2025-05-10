import { Component, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

interface HelpItem {
  icon: string;
  title: string;
  description: string;
  list?: { text: string }[];
}

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [TablerIconComponent, CommonModule],
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  isClosing = false;
  isInitialized = false;

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

  ngOnInit(): void {
    // Set initialized after component is fully rendered to prevent animation glitches
    setTimeout(() => {
      this.isInitialized = true;
    }, 0);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeWithAnimation();
  }

  @HostListener('click', ['$event'])
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.closeWithAnimation();
    }
  }

  closeWithAnimation(): void {
    if (this.isClosing) return;

    this.isClosing = true;

    setTimeout(() => {
      this.close.emit();
    }, 500); // Match animation duration
  }
}
