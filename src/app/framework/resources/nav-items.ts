export interface NavItem {
  name: string;
  icon: string;
  id: string;
  to: string;
}

export const navItemsList: NavItem[] = [
  {
    name: 'Home',
    icon: 'home_app_logo',
    id: 'home-link-navbar',
    to: '/',
  },
  {
    name: 'Reports',
    icon: 'data_usage',
    id: 'report-link-navbar',
    to: '/reports',
  },
  {
    name: 'Account',
    icon: 'account_circle',
    id: 'account-link-navbar',
    to: '/account',
  },
];
