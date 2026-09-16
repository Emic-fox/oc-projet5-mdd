import { Component, computed, input, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Button } from '@shared/components/button/button';
import { InputText } from '@shared/components/forms/input-text/input-text';
import { InputTextarea } from '@shared/components/forms/input-textarea/input-textarea';
import { InputSelect } from '@shared/components/forms/input-select/input-select';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { ErrorsContainer } from '@shared/components/errors-container/errors-container';

export interface ArticleCreateFormData {
  title: string;
  content: string;
  topicId: number | null;
}

@Component({
  imports: [Button, FormField, InputText, InputTextarea, InputSelect, ErrorsContainer],
  selector: 'app-article-create-form',
  template: `
  <form class="flex flex-col gap-4 w-full max-w-md mx-auto" (submit)="onSubmit($event)">
    <app-input-select [formField]="articleForm.topicId" [options]="topicOptions()" placeholder="Sélectionner un thème" data-testid="topic">Thème</app-input-select>

    <app-input-text [formField]="articleForm.title" placeholder="Titre de l'article" data-testid="title">Titre</app-input-text>

    <app-input-textarea [formField]="articleForm.content" placeholder="Contenu de l'article" data-testid="content">Contenu</app-input-textarea>

    <app-button type="submit" class="self-center" data-testid="create-submit" [disabled]="articleForm().invalid()">Créer</app-button>

    <app-errors-container [message]="globalError()" />
  </form>
  `,
})
export class ArticleCreateForm {
  topics = input.required<Topic[]>();
  globalError = input<string | null>(null);
  submitted = output<ArticleCreateFormData>();

  topicOptions = computed(() => this.topics().map((topic) => ({ value: topic.id, label: topic.name })));

  articleModel = signal<ArticleCreateFormData>({ title: '', content: '', topicId: null });

  articleForm = form(this.articleModel, (fieldPath) => {
    required(fieldPath.topicId, { message: 'Le thème est obligatoire' });
    required(fieldPath.title, { message: 'Le titre est obligatoire' });
    required(fieldPath.content, { message: 'Le contenu est obligatoire' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.articleForm, async () => {
      this.submitted.emit(this.articleModel());
    });
  }
}
