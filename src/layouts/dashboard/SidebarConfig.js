import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/flag-outline';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Inicio',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Clientes',
    path: '/dashboard/client',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Proveedores',
    path: '/dashboard/provider',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Productos',
    path: '/dashboard/product',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Ventas',
    path: '/dashboard/sale',
    icon: getIcon(lockFill)
  },
  {
    title: 'Detalle venta',
    path: '/dashboard/detail',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
