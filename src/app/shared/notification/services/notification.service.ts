import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { NotificationModel } from '../../../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public showNotification$: Subject<NotificationModel> = new Subject();
}
