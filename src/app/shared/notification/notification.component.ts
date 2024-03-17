import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { NotificationService } from './services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationModel } from '../../models/notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [],
})
export class NotificationComponent implements OnInit, OnDestroy {
  public hidden: WritableSignal<boolean> = signal(true);
  public content: WritableSignal<string> = signal('');
  public type: WritableSignal<'success' | 'error' | null> = signal(null);
  private timeOutIDs: number[] = [];
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  public ngOnInit(): void {
    this.notificationService.showNotification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: NotificationModel) => {
        this.showNotification(data);
      });
  }

  public ngOnDestroy(): void {
    this.timeOutIDs.forEach((id) => clearTimeout(id));
  }

  private showNotification(data: NotificationModel): void {
    this.hidden.set(false);
    this.content.set(data.content);
    this.type.set(data.type);
    this.timeOutIDs.push(
      setTimeout(() => {
        this.hidden.set(true);
        this.content.set('');
        this.type.set(null);
      }, data.duration),
    );
  }
}
