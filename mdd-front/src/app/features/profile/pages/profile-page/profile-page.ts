import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProfileForm, ProfileFormData } from '@shared/components/forms/profile-form/profile-form';
import { AuthService } from '@app/features/auth/services/auth.service';
import { TopicsList } from '@/app/features/topics/components/topics-list/topics-list';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { TopicsService } from '@/app/features/topics/services/topics.service';
import { Notifier } from '@app/core/services/notifier.service';
import { ApiError } from '@app/core/errors/api-error';
import { ErrorsContainer } from '@shared/components/errors-container/errors-container';

@Component({
  imports: [ProfileForm, TopicsList, ErrorsContainer],
  selector: 'app-profile-page',
  template: `
  <section class="flex flex-col items-center gap-2">
    <h2 class="font-bold text-3xl">Profil utilisateur</h2>
    <app-profile-form [initialData]="initialData()" [passwordRequired]="false" submitLabel="Sauvegarder" [globalError]="error()" (submitted)="onProfileUpdate($event)" />
  </section>
  <hr class="mx-12 my-4" />
  <section class="flex flex-col items-stretch gap-2">
    <h2 class="font-bold text-3xl self-center">Abonnements</h2>
    <app-errors-container [message]="topicsError()" />
    <app-topics-list [topics]="topics()" (unsubscribe)="onUnsubscribe($event)" />
  </section>
`,
})
export class ProfilePage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly topicsService = inject(TopicsService);
  private readonly notifier = inject(Notifier);

  protected readonly initialData = computed(() => ({
    username: this.auth.user()?.username ?? '',
    email: this.auth.user()?.email ?? '',
  }));

  readonly topics = signal<Topic[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly topicsError = signal<string | null>(null);

  ngOnInit() {
    this.topicsService.getTopics({ subscribed: true }).subscribe({
      next: (topics) => this.topics.set(topics),
      error: (err: ApiError) => this.topicsError.set(err.message),
    });
  }

  onUnsubscribe(id: number) {
    this.topics.update(topics => topics.filter(topic => topic.id != id));
  }

  onProfileUpdate(data: ProfileFormData) {
    this.error.set(null);

    if (this.auth.user()?.username != data.username || this.auth.user()?.email != data.email) {
      this.auth.updateProfile(data.username, data.email).subscribe({
        next: () => this.notifier.success('Profil mis à jour.'),
        error: (err: ApiError) => this.error.set(err.message),
      });
    }

    if (data.password) {
      this.auth.updatePassword(data.password).subscribe({
        next: () => this.notifier.success('Mot de passe mis à jour.'),
        error: (err: ApiError) => this.error.set(err.message),
      });
    }
  }
}
