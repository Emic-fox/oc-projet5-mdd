import { Component, computed, inject, input, output } from '@angular/core';
import { Topic } from '../../models/topic.interface';
import { Button } from '@/app/shared/components/button/button';
import { Card } from '@/app/shared/components/card/card';
import { TopicsService } from '../../services/topics.service';
import { tap } from 'rxjs';
import { ApiError } from '@app/core/errors/api-error';
import { Notifier } from '@app/core/services/notifier.service';

@Component({
  imports: [Button, Card],
  selector: 'app-topic-card',
  template: `<app-card>
    <ng-content label>{{ topic().name }}</ng-content>
    <p class="grow">{{ topic().description }}</p>
    <app-button
      class="w-40 self-center"
      [disabled]="!subscribeButtonEnabled()"
      (click)="onSubscribeClick($event)"
    >{{ subscribeButtonLabel() }}</app-button>
  </app-card>`,
})
export class TopicCard {
  topic = input.required<Topic>();
  allowUnsubcription = input<boolean>(true);

  subscribe = output<number>();
  unsubscribe = output<number>();

  topicsService = inject(TopicsService);
  private notifier = inject(Notifier);

  subscribeButtonLabel = computed<string>(() => {
    if (this.topic().subscribed) {
      return this.allowUnsubcription() ? "Se désabonner" : "Déjà abonné";
    } else {
      return "S'abonner";
    }
  })

  subscribeButtonEnabled = computed<boolean>(() => {
    return !this.topic().subscribed || this.allowUnsubcription();
  })

  onSubscribeClick(event: Event) {
    event.preventDefault();
    const id = this.topic().id;
    if (this.topic().subscribed) {
      this.topicsService.unsubscribe(id).pipe(
        tap(() => this.unsubscribe.emit(id))
      ).subscribe({ error: (err: ApiError) => this.notifier.error(err.message) });
    } else {
      this.topicsService.subscribe(id).pipe(
        tap(() => this.subscribe.emit(id))
      ).subscribe({ error: (err: ApiError) => this.notifier.error(err.message) });
    }
  }
}
