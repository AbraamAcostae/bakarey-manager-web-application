import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Main shell component that hosts top-level navigation and routed content.
 */
@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  options = signal([
    { link: '/home', label: 'option.home', icon: 'bar_chart' },
    { link: '/monitoring', label: 'option.iot', icon: 'sensors' },
    { link: '/production', label: 'option.production', icon: 'precision_manufacturing' },
    { link: '/inventory', label: 'option.inventory', icon: 'inventory_2' },
  ]);

  private readonly authRoutes = ['/sign-in', '/sign-up'];
  private readonly routeTitleMap = new Map<string, string>([
    ['/home', 'option.home'],
    ['/monitoring', 'option.iot'],
    ['/production', 'option.production'],
    ['/inventory', 'option.inventory'],
    ['/about', 'option.about'],
  ]);

  showShell = signal(false);
  isProfileRoute = signal(false);
  currentSectionLabel = signal('option.home');

  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  readonly currentUserName = this.iamStore.currentUsername();

  openProfileSettings(): void {
    this.router.navigate(['/profile']).then();
  }

  signOut(): void {
    this.iamStore.signOut(this.router);
  }

  userInitials(): string {
    const username = this.iamStore.currentUsername() || 'Bakery User';
    const cleanName = username.replace(/[@._-]+/g, ' ').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean).slice(0, 2);

    if (parts.length === 0) {
      return 'BU';
    }

    return parts
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  constructor() {
    const router = this.router;
    const updateRouteState = (url: string) => {
      const normalizedUrl = url.split('?')[0].split('#')[0];
      const matchedRoute = [...this.routeTitleMap.entries()].find(([route]) =>
        normalizedUrl === route || normalizedUrl.startsWith(`${route}/`),
      );

      this.showShell.set(!this.authRoutes.some(r => normalizedUrl.startsWith(r)));
      this.isProfileRoute.set(normalizedUrl.startsWith('/profile'));
      this.currentSectionLabel.set(matchedRoute ? matchedRoute[1] : 'option.home');
    };

    const initialPath = window.location.pathname;
    const isAuthInitially =
      this.authRoutes.some(r => initialPath.startsWith(r)) || initialPath === '/';
    this.showShell.set(!isAuthInitially);
    this.isProfileRoute.set(initialPath.startsWith('/profile'));
    this.currentSectionLabel.set(this.routeTitleMap.get(initialPath.split('?')[0].split('#')[0]) ?? 'option.home');

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        updateRouteState(event.urlAfterRedirects);
      });
  }
}
