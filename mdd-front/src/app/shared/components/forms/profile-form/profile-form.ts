import { Component, input, linkedSignal, output } from '@angular/core';
import { applyWhen, form, FormField, required, email, minLength, pattern, submit } from '@angular/forms/signals';
import { Button } from "@shared/components/button/button";
import { InputText } from "@shared/components/forms/input-text/input-text";
import { InputPassword } from "@shared/components/forms/input-password/input-password";

export interface ProfileFormData {
  username: string;
  email: string;
  password: string;
}

/** Sous-ensemble du modèle utilisable pour pré-remplir le formulaire (sans le mot de passe). */
export type ProfileFormInitialData = Pick<ProfileFormData, 'username' | 'email'>;

/**
 * Formulaire générique (nom d'utilisateur / e-mail / mot de passe), utilisé
 * aussi bien pour l'inscription (champs vides, "S'inscrire") que pour
 * l'édition du profil (username/email pré-remplis, "Sauvegarder").
 */
@Component({
  imports: [Button, FormField, InputText, InputPassword],
  selector: 'app-profile-form',
  template: `
  <form class="flex flex-col items-center gap-4 w-full max-w-sm" (submit)="onSubmit($event)">
    <app-input-text [formField]="profileForm.username" placeholder="john.doe" autocomplete="username" data-testid="username">Nom d'utilisateur</app-input-text>

    <app-input-text [formField]="profileForm.email" type="email" placeholder="john.doe@example.com" autocomplete="email" data-testid="email">Adresse e-mail</app-input-text>

    <app-input-password [formField]="profileForm.password" autocomplete="new-password" data-testid="password" />

    <app-button type="submit" data-testid="profile-submit" [disabled]="profileForm().invalid()">{{ submitLabel() }}</app-button>
  </form>`,
})
export class ProfileForm {
  /** Valeurs initiales (username/email), pour pré-remplir le formulaire */
  initialData = input<ProfileFormInitialData>({ username: '', email: '' });
  /** Libellé du bouton de soumission */
  submitLabel = input.required<string>();
  /** Le mot de passe est-il obligatoire (inscription) ou facultatif (édition de profil) ? */
  passwordRequired = input(true);

  submitted = output<ProfileFormData>();

  profileModel = linkedSignal<ProfileFormData>(() => ({
    ...this.initialData(),
    password: '',
  }));

  profileForm = form(this.profileModel, (fieldPath) => {
    required(fieldPath.username, { message: "Le nom d'utilisateur est obligatoire" });

    required(fieldPath.email, { message: "L'adresse e-mail est obligatoire" });
    email(fieldPath.email, { message: "L'adresse e-mail doit être valide" });

    applyWhen(
      fieldPath.password,
      (ctx) => this.passwordRequired() || ctx.value() !== '',
      (password) => {
        required(password, { message: 'Le mot de passe est obligatoire' });
        minLength(password, 8, { message: 'Le mot de passe doit contenir au moins 8 caractères' });
        pattern(password, /[0-9]/, { message: 'Le mot de passe doit contenir au moins 1 chiffre' });
        pattern(password, /[a-z]/, { message: 'Le mot de passe doit contenir au moins 1 minuscule' });
        pattern(password, /[A-Z]/, { message: 'Le mot de passe doit contenir au moins 1 majuscule' });
        pattern(password, /[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins 1 caractère spécial' });
      },
    );
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.profileForm, async () => {
      this.submitted.emit(this.profileModel());
    });
  }
}
