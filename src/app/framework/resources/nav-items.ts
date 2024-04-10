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

export interface Path{
  to:string;
  subname:string[];
  name:string;
}
export const allPaths:Path[]=[
  {
    name: 'Home',
    to: '/',
    subname:[]
  },
  {
    name: 'Reports',
    to: '/reports',
    subname:[]
  },
  {
    name: 'Account',
    to: '/account',
    subname:[]
  },
  {
    name: 'Logging',
    to: '/logging/meal',
    subname:['Meal']
  },
  {
    name: 'Logging',
    to: '/logging/exercise',
    subname:['Exercise']
  },
  {
    name: 'Logging',
    to: '/logging/water',
    subname:['Water']
  },
  {
    name: 'Logging',
    to: '/logging/sleep',
    subname:['Sleep']
  }
]