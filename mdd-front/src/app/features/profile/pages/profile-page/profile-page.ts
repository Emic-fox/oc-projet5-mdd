import { Component, inject, signal } from '@angular/core';
import { ProfileForm } from '../../components/profile-form/profile-form';
import { TopicsList } from '@/app/features/topics/components/topics-list/topics-list';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { TopicsService } from '@/app/features/topics/services/topics.service';

@Component({
  imports: [ProfileForm, TopicsList],
  selector: 'app-profile-page',
  styles: ``,
  template: `
  <section class="flex flex-col items-center gap-2">
    <h2 class="font-bold text-3xl">Profil utilisateur</h2>
    <app-profile-form />
  </section>
  <hr class="mx-12 my-4" />
  <section class="flex flex-col items-stretch gap-2">
    <h2 class="font-bold text-3xl self-center">Abonnements</h2>
    <app-topics-list [topics]="topics()" (unsubscribe)="onUnsubscribe($event)" />
  </section>
`,
})
export class ProfilePage {
  private topicsService = inject(TopicsService);
  
  topics = signal<Topic[]>([]);

  ngOnInit() {
    this.topicsService.getTopics({ subscribed: true }).subscribe(topics => this.topics.set(topics));
  }

  onUnsubscribe(id: number) {
    this.topics.update(topics => topics.filter(topic => topic.id != id));
  }
}
