import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavItem, Path, allPaths, navItemsList } from '../resources/nav-items';
import { AuthenticationService } from '../../services/authentication.service';
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

  private bottomBarShowCase: string[] = ['/', '/account', '/reports'];
  currentPage: Path = allPaths[0];
  showBottomBar: boolean = true;
  showTopBar: boolean = false;
  navItems: NavItem[] = navItemsList;
  paths: Path[] = allPaths;


  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRouterState = this.router.routerState;
        // console.log(currentRouterState.snapshot.url);

        const activeNavItem = this.paths.filter((item) => {
          if (currentRouterState.snapshot.url.includes(item.to)) {
            return true;
          }
          return false;
        });
        this.currentPage = activeNavItem[activeNavItem.length - 1];

        if (this.bottomBarShowCase.includes(currentRouterState.snapshot.url)) {
          this.showBottomBar = true;
          this.showTopBar = false;
        } else {
          this.showBottomBar = false;
          this.showTopBar = true;
        }
        if (currentRouterState.snapshot.url.includes('/auth')) {
          this.showBottomBar = false;
          this.showTopBar = false;
        }

        if(this._authService.isAuthenticated() && currentRouterState.snapshot.url.includes('/auth')){
          this.router.navigate(['']);
        }
        if(!this._authService.isAuthenticated()){
            this.router.navigate(['/auth']);
        }
      });
  }
  goBack(): void {
    this.router.navigate(['../']);
  }
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
