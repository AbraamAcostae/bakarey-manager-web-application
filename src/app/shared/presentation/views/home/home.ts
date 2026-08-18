import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Home view for the shared presentation context.
 */
@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly iamStore = inject(IamStore);

  readonly currentUserName = this.iamStore.currentUsername();
}
