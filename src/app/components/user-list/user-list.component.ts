import { Component, EventEmitter, input, Output } from '@angular/core';

import { UserModel } from '../../models/user.model';
import { CommonTableComponent } from '../../shared/common-table/common-table.component';
import { ColumnConfigModel } from '../../models/column-config-model';
import { ColumnWidthEnum } from '../../enums/column-width.enum';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonTableComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Output() public selectUser = new EventEmitter<UserModel>();
  public users = input.required<UserModel[]>();
  public serviceRequestColumn: ColumnConfigModel[] = [
    {
      width: ColumnWidthEnum.Xl,
      property: 'username',
    },
    {
      width: ColumnWidthEnum.Xl,
      property: 'first_name',
    },
    {
      width: ColumnWidthEnum.Xl,
      property: 'last_name',
    },
    {
      width: ColumnWidthEnum.Xl,
      property: 'email',
    },
    {
      width: ColumnWidthEnum.Xl,
      property: 'user_type',
    },
  ];
  public serviceRequestColumnsHeaderData = {
    username: 'USERNAME',
    first_name: 'FIRSTNAME',
    last_name: 'LASTNAME',
    email: 'EMAIL',
    user_type: 'TYPE',
  };

  public onRowClick(user: UserModel): void {
    this.selectUser.emit(user);
  }
}
