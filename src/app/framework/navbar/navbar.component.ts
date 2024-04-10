import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavItem, Path, allPaths, navItemsList } from '../resources/nav-items';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private bottomBarShowCase: string[] = ['/', '/account', '/reports'];
  currentPage: Path = allPaths[0];
  showBottomBar: boolean = true;
  navItems: NavItem[] = navItemsList;
  paths:Path[]=allPaths;

  constructor(private router: Router) {}

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
        } else {
          this.showBottomBar = false;
        }
      });
  }
  goBack():void{
    this.router.navigate(['../']);
  }
  goToHome():void{
    this.router.navigate(['/']);
  }
}
