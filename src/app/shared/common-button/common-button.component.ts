import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-common-button',
  templateUrl: './common-button.component.html',
  styleUrls: ['./common-button.component.scss'],
  standalone: true,
})
export class CommonButtonComponent {
  @Output() public btnClick = new EventEmitter<void>();
  public btnType = input<'red' | 'blue'>('blue');

  public handleClick(): void {
    this.btnClick.emit();
  }
}
