import { Component, inject, OnInit, signal } from '@angular/core';
import { TopicsList } from '../../components/topics-list/topics-list';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../models/topic.interface';

@Component({
  imports: [TopicsList],
  selector: 'app-topics-page',
  template: `<app-topics-list
    [topics]="topics()"
    [allowUnsubcription]="false"
    (subscribe)="onSubscribe($event)"
    (unsubscribe)="onUnsubscribe($event)"
  />`,
})
export class TopicsPage implements OnInit {
  private topicsService = inject(TopicsService);

  topics = signal<Topic[]>([]);

  ngOnInit() {
    this.topicsService.getTopics({ subscribed: false }).subscribe(topics => this.topics.set(topics));
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
