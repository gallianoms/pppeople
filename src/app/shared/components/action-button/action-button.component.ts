import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';

export type ButtonTheme = 'emerald' | 'sky' | 'pink' | 'gray';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, TablerIconComponent],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent {
  public readonly icon = input<string>('');
  public readonly activeIcon = input<string | null>(null);
  public readonly label = input<string>('');
  public readonly activeLabel = input<string | null>(null);
  public readonly isActive = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly theme = input<ButtonTheme>('gray');
  public readonly width = input<string>('auto');
  public readonly constantShine = input<boolean>(false);
  public readonly actionClick = output<void>();

  public get buttonTheme(): string {
    const themeMap: Record<ButtonTheme, string> = {
      emerald: 'border-emerald-400/50 hover:bg-emerald-500/20',
      sky: 'border-sky-400/50 hover:bg-sky-500/20',
      pink: 'border-pink-400/50 hover:bg-pink-500/20',
      gray: 'border-gray-400/50 hover:bg-gray-500/20'
    };
    return `${themeMap[this.theme()]} ${this.constantShine() ? 'constant-shine' : ''}`;
  }

  public get displayIcon(): string {
    return (this.isActive() && this.activeIcon() ? this.activeIcon()! : this.icon()) || '';
  }

  public get displayLabel(): string {
    return (this.isActive() && this.activeLabel() ? this.activeLabel()! : this.label()) || '';
  }
}
