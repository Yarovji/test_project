import { Component, EventEmitter, input, Output } from '@angular/core';
import { NgStyle } from '@angular/common';

import { ColumnConfigModel } from '../../models/column-config-model';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss'],
  standalone: true,
  imports: [NgStyle],
})
export class CommonTableComponent {
  public data = input<any>();
  public columns = input.required<ColumnConfigModel[]>();
  public headerMode = input<boolean>(false);
  @Output() public rowClick = new EventEmitter<void>();

  public onRowClick(): void {
    this.rowClick.emit();
  }
}
