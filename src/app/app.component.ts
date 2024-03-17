import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';
import { CommonButtonComponent } from './shared/common-button/common-button.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddOrEditUserComponent } from './components/add-or-edit-user/add-or-edit-user.component';
import { NotificationComponent } from './shared/notification/notification.component';
import { NotificationService } from './shared/notification/services/notification.service';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonButtonComponent,
    UserListComponent,
    AddOrEditUserComponent,
    NotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public users: WritableSignal<UserModel[]> = signal([]);
  public selectedUser: WritableSignal<UserModel | null> = signal(null);
  public createNewUser: WritableSignal<boolean> = signal(false);
  private userService: UserService = inject(UserService);
  private notificationService = inject(NotificationService);

  public ngOnInit(): void {
    this.users.set(this.userService.getUsers());
  }

  public selectUser(user: UserModel): void {
    this.selectedUser.set(user);
  }

  public createUser(): void {
    this.selectedUser.set(null);
    this.createNewUser.set(true);
  }

  public closeForm(): void {
    this.selectedUser.set(null);
    this.createNewUser.set(false);
  }

  public deleteUser(): void {
    this.users.update((arr) => {
      return arr.filter(
        (item) => item.username !== this.selectedUser()?.username,
      );
    });
    this.closeForm();
    this.showSuccessMessage();
  }

  public editUser(user: UserModel): void {
    this.users.update((arr) => {
      return arr.map((item) => {
        if (item.username === this.selectedUser()?.username) {
          return {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            user_type: user.user_type,
            password: user.password,
          };
        } else {
          return item;
        }
      });
    });
    this.closeForm();
    this.showSuccessMessage();
  }

  public addNewUser(user: UserModel): void {
    this.users.update((arr) => {
      return [
        ...arr,
        {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_type: user.user_type,
          password: user.password,
        },
      ];
    });
    this.closeForm();
    this.showSuccessMessage();
  }

  private showSuccessMessage(): void {
    this.notificationService.showNotification$.next({
      content: 'Success message',
      type: 'success',
      duration: 3000,
    });
  }
}
