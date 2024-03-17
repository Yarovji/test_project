import { Injectable } from '@angular/core';

import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  public getUsers(): UserModel[] {
    const mockUser: UserModel = {
      username: 'mperry',
      first_name: 'Matthew',
      last_name: 'Perry',
      email: 'matthew@mail.com',
      password: '1234567A',
      user_type: 'Administrator',
    };

    const users: UserModel[] = [];
    for (let i = 0; i < 10; i++) {
      users.push({ ...mockUser, username: mockUser.username + i });
    }
    return users;
  }
}
