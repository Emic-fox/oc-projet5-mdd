import { Component, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-comment-create-form',
  template: `<form class="flex items-center gap-3 w-full" (submit)="onSubmit($event)">
    <textarea
      class="border rounded-md px-3 py-2 flex-1 resize-none"
      rows="4"
      [value]="content()"
      (input)="content.set($any($event.target).value)"
      placeholder="Écrivez ici votre commentaire"
      data-testid="comment-content-input"
    ></textarea>
    <button
      type="submit"
      class="cursor-pointer shrink-0 self-center disabled:opacity-50 disabled:cursor-not-allowed"
      [disabled]="!content().trim()"
      aria-label="Envoyer le commentaire"
      data-testid="comment-submit"
    >
      <img src="assets/icons/send.svg" alt="" class="h-10 w-auto" />
    </button>
  </form>`,
})
export class CommentCreateForm {
  submitted = output<string>();

  content = signal('');

  onSubmit(event: Event) {
    event.preventDefault();
    const content = this.content().trim();
    if (!content) return;

    this.submitted.emit(content);
    this.content.set('');
  }
}
