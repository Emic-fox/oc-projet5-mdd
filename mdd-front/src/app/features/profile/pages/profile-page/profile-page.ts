import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ProfileForm, ProfileFormData } from '@shared/components/forms/profile-form/profile-form';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TopicsList } from '@/app/features/topics/components/topics-list/topics-list';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { TopicsService } from '@/app/features/topics/services/topics.service';

@Component({
  imports: [ProfileForm, TopicsList],
  selector: 'app-profile-page',
  template: `
  <section class="flex flex-col items-center gap-2">
    <h2 class="font-bold text-3xl">Profil utilisateur</h2>
    <app-profile-form [initialData]="initialData()" [passwordRequired]="false" submitLabel="Sauvegarder" (submitted)="onProfileUpdate($event)" />
  </section>
  <hr class="mx-12 my-4" />
  <section class="flex flex-col items-stretch gap-2">
    <h2 class="font-bold text-3xl self-center">Abonnements</h2>
    <app-topics-list [topics]="topics()" (unsubscribe)="onUnsubscribe($event)" />
  </section>
`,
})
export class ProfilePage {
  protected auth = inject(AuthService);
  private topicsService = inject(TopicsService);

  protected initialData = computed(() => ({
    username: this.auth.user()?.username ?? '',
    email: this.auth.user()?.email ?? '',
  }));

  topics = signal<Topic[]>([]);

  ngOnInit() {
    this.topicsService.getTopics({ subscribed: true }).subscribe(topics => this.topics.set(topics));
  }

  onUnsubscribe(id: number) {
    this.topics.update(topics => topics.filter(topic => topic.id != id));
  }

  onProfileUpdate(data: ProfileFormData) {
    const requests: Observable<unknown>[] = [];

    if (this.auth.user()?.username != data.username || this.auth.user()?.email != data.email) {
      requests.push(this.auth.updateProfile(data.username, data.email));
    }

    if (data.password) {
      requests.push(this.auth.updatePassword(data.password));
    }

    if (requests.length === 0) {
      return;
    }

    forkJoin(requests).subscribe(() => this.auth.refreshUser());
  }
}
