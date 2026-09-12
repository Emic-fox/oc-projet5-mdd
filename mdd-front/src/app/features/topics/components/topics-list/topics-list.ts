import { Component, input } from '@angular/core';
import { TopicCard } from '../topic-card/topic-card';
import { Topic } from '../../models/topic.interface';

@Component({
  imports: [TopicCard],
  selector: 'app-topics-list',
  template: `<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-1 gap-y-2 w-full">
    @for (topic of topics(); track topic.id) {
      <app-topic-card class="w-full" [topic]="topic" [allowUnsubcription]="allowUnsubcription()" />
    }
  </div>`,
})
export class TopicsList {
  topics = input.required<Topic[]>();
  allowUnsubcription = input<boolean>(true);
}
