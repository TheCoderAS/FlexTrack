import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { NavItem, Path, allPaths, navItemsList } from '../resources/nav-items';
import { AuthenticationService } from '../../services/authentication.service';
import { ApiService } from '../../services/api.service';
import nls from '../resources/nls/generic';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private router: Router = inject(Router);
  private _authService = inject(AuthenticationService);
  private _api: ApiService = inject(ApiService);

  private bottomBarShowCase: string[] = ['/', '/account', '/reports', '/add-tasks', '/add-schedules'];
  currentPage: WritableSignal<Path> = signal(allPaths[0]);
  showBottomBar: WritableSignal<boolean> = signal(true);
  showTopBar: WritableSignal<boolean> = signal(false);
  navItems: NavItem[] = navItemsList;
  paths = new BehaviorSubject<Path[]>(allPaths);
  nls = nls

  ngOnInit() {
    this.buildPathsFromWidgets()
    this.subscribeRouterEvents();
  }

  subscribeRouterEvents() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRouterState = this.router.routerState;
        const activeNavItem = this.paths.getValue().filter((item) => {
          if (currentRouterState.snapshot.url.includes(item.to)) {
            return true;
          }
          return false;
        });
        this.currentPage.set(activeNavItem[activeNavItem.length - 1]);

        if (this.bottomBarShowCase.includes(currentRouterState.snapshot.url)) {
          this.showBottomBar.set(true);
          this.showTopBar.set(false);
        } else {
          this.showBottomBar.set(false);
          this.showTopBar.set(true);
        }
        if (currentRouterState.snapshot.url.includes('/auth')) {
          this.showBottomBar.set(false);
          this.showTopBar.set(false);
        }

        if (this._authService.isAuthenticated.getValue() && currentRouterState.snapshot.url.includes('/auth')) {
          this.router.navigate(['']);
        }
        if (!this._authService.isAuthenticated.getValue()) {
          this.router.navigate(['/auth']);
        }
      });

  }
  async buildPathsFromWidgets() {
    let widgets = await this._api.local_get('widgets');
    let widgetPaths: Path[] = [];
    widgets.forEach((element: any) => {
      let path: Path = {
        to: '/logging/' + encodeURIComponent(element.id),
        subname: [element.title],
        name: nls.navbar.logging
      }
      widgetPaths.push(path);
    });
    this.paths.next([...allPaths, ...widgetPaths]);

  }
  goBack(): void {
    this.router.navigate(['../']);
  }
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
