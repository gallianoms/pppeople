import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [TablerIconComponent],
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();

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
