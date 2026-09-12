import { Component, computed, input, output } from '@angular/core';
import { Topic } from '../../models/topic.interface';
import { Button } from '@/app/shared/components/button/button';
import { Card } from '@/app/shared/components/card/card';

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
  
  subscribe = output<void>();
  unsubscribe = output<void>();

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
    if (this.topic().subscribed) {
      this.unsubscribe.emit();
    } else {
      this.subscribe.emit();
    }
  }
}
