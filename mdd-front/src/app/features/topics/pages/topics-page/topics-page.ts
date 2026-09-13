import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TopicsList } from '../../components/topics-list/topics-list';
import { TopicsService } from '../../services/topics.service';

@Component({
  imports: [TopicsList, AsyncPipe],
  selector: 'app-topics-page',
  template: `<app-topics-list [topics]="(topics$ | async) ?? []" [allowUnsubcription]="false" />`,
})
export class TopicsPage {
  private topicsService = inject(TopicsService);

  topics$ = this.topicsService.getTopics({ subscribed: false });
}
