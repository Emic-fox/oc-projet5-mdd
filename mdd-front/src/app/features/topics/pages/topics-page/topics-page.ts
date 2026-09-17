import { Component, inject, OnInit, signal } from '@angular/core';
import { TopicsList } from '../../components/topics-list/topics-list';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../models/topic.interface';
import { ApiError } from '@app/core/errors/api-error';
import { ErrorsContainer } from '@shared/components/errors-container/errors-container';

@Component({
  imports: [TopicsList, ErrorsContainer],
  selector: 'app-topics-page',
  template: `
  <app-errors-container [message]="error()" />
  <app-topics-list
    [topics]="topics()"
    [allowUnsubcription]="false"
    (subscribe)="onSubscribe($event)"
    (unsubscribe)="onUnsubscribe($event)"
  />`,
})
export class TopicsPage implements OnInit {
  private readonly topicsService = inject(TopicsService);

  topics = signal<Topic[]>([]);
  error = signal<string | null>(null);

  ngOnInit() {
    this.topicsService.getTopics({ subscribed: false }).subscribe({
      next: (topics) => this.topics.set(topics),
      error: (err: ApiError) => this.error.set(err.message),
    });
  }

  onSubscribe(id: number) {
    this.setSubscribed(id, true);
  }

  onUnsubscribe(id: number) {
    this.setSubscribed(id, false);
  }

  private setSubscribed(id: number, subscribed: boolean) {
    this.topics.update(topics =>
      topics.map(topic => topic.id === id ? { ...topic, subscribed } : topic)
    );
  }
}
