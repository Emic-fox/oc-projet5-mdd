import { Component } from '@angular/core';
import { TopicsList } from '../../components/topics-list/topics-list';
import { Topic } from '../../models/topic.interface';

@Component({
  imports: [TopicsList],
  selector: 'app-topics-page',
  template: `<app-topics-list [topics]="topics" [allowUnsubcription]="false" />`,
})
export class TopicsPage {
  topics: Topic[] = [
    {
      id: 1,
      name: "Thème 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae viverra mi. Curabitur mattis nisi nec cursus convallis. Suspendisse potenti. Ut porta massa ac augue molestie, eu dapibus nisi sollicitudin. Donec varius risus a nulla auctor bibendum. Pellentesque at ex eu mauris bibendum venenatis. Etiam aliquet odio ac gravida varius.",
      subscribed: false
    },
    {
      id: 2,
      name: "Thème 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent urna nibh, semper et hendrerit vitae, hendrerit ultricies dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      subscribed: true
    },
  ]
}
