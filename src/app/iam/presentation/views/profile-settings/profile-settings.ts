import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { IamStore } from '../../../application/iam.store';

/**
 * Profile settings view for user profile management.
 */
@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    LanguageSwitcher,
  ],
  template: `
    <div class="profile-settings-container">
      <div class="profile-settings-header">
        <h1>{{ 'profile.title' | translate }}</h1>
      </div>

      <div class="profile-settings-card">
        <div class="profile-section-user">
          <div class="profile-avatar-large">{{ userInitials() }}</div>
          <div class="profile-info">
            <span class="profile-label">{{ 'profile.user' | translate }}</span>
            <strong class="profile-username">{{ currentUserName || ('profile.default-user' | translate) }}</strong>
          </div>
        </div>

        <div class="profile-divider"></div>

        <div class="profile-section-options">
          <h3 class="section-title">{{ 'profile.options' | translate }}</h3>
          <div class="profile-options-large">
            <button type="button" class="profile-option-btn">
              <mat-icon>lock</mat-icon>
              <div class="option-content">
                <span class="option-title">{{ 'profile.change-password' | translate }}</span>
                <span class="option-desc">{{ 'profile.change-password-desc' | translate }}</span>
              </div>
            </button>

            <button type="button" class="profile-option-btn">
              <mat-icon>mail</mat-icon>
              <div class="option-content">
                <span class="option-title">{{ 'profile.email' | translate }}</span>
                <span class="option-desc">{{ 'profile.email-desc' | translate }}</span>
              </div>
            </button>

            <button type="button" class="profile-option-btn">
              <mat-icon>settings</mat-icon>
              <div class="option-content">
                <span class="option-title">{{ 'profile.more-options' | translate }}</span>
                <span class="option-desc">{{ 'profile.more-options-desc' | translate }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="language-section">
          <div class="section-header">
            <mat-icon>language</mat-icon>
            <span>{{ 'profile.language' | translate }}</span>
          </div>
          <app-language-switcher class="language-switcher-profile"/>
        </div>

        <button type="button" class="signout-btn" (click)="signOut()">
          <mat-icon>logout</mat-icon>
          {{ 'profile.sign-out' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-settings-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 0;
      background: transparent;
      min-height: auto;
      width: min(100%, 430px);
      margin-inline: auto;
    }

    .profile-settings-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      text-align: center;
    }

    .profile-settings-header h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-on-cream);
      font-weight: 700;
    }

    .profile-settings-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 430px;
      overflow: hidden;
      padding: 28px 28px 22px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 0 auto;
      align-self: center;
    }

    .profile-section-user {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0;
    }

    .profile-avatar-large {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #f8d7b6, #d4671e);
      color: #2f1f11;
      font-weight: 700;
      font-size: 1.6rem;
      flex-shrink: 0;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 4px;
    }

    .profile-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #999;
      font-weight: 600;
    }

    .profile-username {
      font-size: 1.1rem;
      color: var(--text-on-cream);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .profile-divider {
      height: 1px;
      background: #e5e5e5;
      margin: 12px 0;
    }

    .profile-section-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
    }

    .profile-options-large {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .profile-option-btn {
      appearance: none;
      border: 1px solid #e5e5e5;
      background: #fff;
      color: var(--text-on-cream);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .profile-option-btn:hover {
      background: #f8f8f8;
      border-color: #d4671e;
      box-shadow: 0 2px 8px rgba(212, 103, 30, 0.1);
    }

    .profile-option-btn mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #d4671e;
      flex-shrink: 0;
    }

    .option-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .option-title {
      font-weight: 600;
      display: block;
      font-size: 0.95rem;
    }

    .option-desc {
      font-size: 0.85rem;
      color: #999;
      display: block;
    }

    .language-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: #f8f8f8;
      border-radius: 10px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--text-on-cream);
      font-size: 0.95rem;
    }

    .section-header mat-icon {
      color: #d4671e;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .language-switcher-profile {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
    }

    .signout-btn {
      appearance: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #ff4444;
      border: none;
      color: #fff;
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
      margin-top: 8px;
    }

    .signout-btn:hover {
      background: #e03333;
    }

    .signout-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      .profile-settings-container {
        padding: 16px;
      }

      .profile-settings-card {
        max-width: 100%;
        padding: 20px;
      }

      .profile-settings-header h1 {
        font-size: 1.5rem;
      }

      .profile-avatar-large {
        width: 64px;
        height: 64px;
        font-size: 1.4rem;
      }
    }
  `]
})
export class ProfileSettings {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  readonly currentUserName = this.iamStore.currentUsername();

  userInitials(): string {
    const username = this.iamStore.currentUsername() || 'Bakery User';
    const cleanName = username.replace(/[@._-]+/g, ' ').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean).slice(0, 2);

    if (parts.length === 0) {
      return 'BU';
    }

    return parts
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  goBack(): void {
    this.router.navigate(['/home']).then();
  }

  signOut(): void {
    this.iamStore.signOut(this.router);
  }
}
