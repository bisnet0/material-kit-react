import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Empresas',
    path: '/companies',
    icon: icon('ic-companies'),
  },
  {
    title: 'Notas Fiscais',
    path: '/invoices',
    icon: icon('ic-invoices'),
  }
];
