import nls from "./nls/generic";

export interface NavItem {
  name: string;
  icon: string;
  id: string;
  to: string;
}

export const navItemsList: NavItem[] = [
  {
    name: nls.navbar.home,
    icon: 'home_app_logo',
    id: 'home-link-navbar',
    to: '/',
  },
  {
    name: nls.navbar.tasks,
    icon: 'add_task',
    id: 'add-tasks-link-navbar',
    to: '/add-tasks',
  },

  {
    name: nls.navbar.schedule,
    icon: 'calendar_month',
    id: 'schedule-link-navbar',
    to: '/add-schedules',
  },
  {
    name: nls.navbar.account,
    icon: 'account_circle',
    id: 'account-link-navbar',
    to: '/account',
  },
];

export interface Path {
  to: string;
  subname: string[];
  name: string;
}
export const allPaths: Path[] = [
  {
    name: nls.navbar.home,
    to: '/',
    subname: []
  },
  {
    name: nls.navbar.reports,
    to: '/reports',
    subname: []
  },
  {
    name: nls.navbar.tasks,
    to: '/add-tasks',
    subname: []
  },
  {
    name: nls.navbar.schedule,
    to: '/add-schedules',
    subname: []
  },
  {
    name: nls.navbar.account,
    to: '/account',
    subname: []
  },
]