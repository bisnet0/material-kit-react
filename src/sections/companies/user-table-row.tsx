import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { fCnpj } from 'src/utils/format-cnpj';
import { CompanyEditModal } from 'src/components/modal/company-edit-modal';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  _id: string;
  description: string;
  cnpj: number;
  municipalRegistration: number;
  status: boolean;
  avatarUrl: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdated: () => void; // <<< adicionando prop para acionar atualização no pai
};

export function UserTableRow({ row, selected, onSelectRow, onUpdated }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
    handleClosePopover(); // fecha o popover ao abrir o modal
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row._id}</TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            {row.description}
          </Box>
        </TableCell>

        <TableCell>{fCnpj(row.cnpj)}</TableCell>
        <TableCell>{row.municipalRegistration}</TableCell>

        <TableCell>
          <Label color={row.status ? 'success' : 'error'}>
            {row.status ? 'Ativo' : 'Inativado'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleOpenEditModal}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </Popover>

      {/* MODAL DE EDIÇÃO */}
      <CompanyEditModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={() => {
          handleCloseEditModal();
          onUpdated(); // <<< dispara o update no componente pai
        }}
        company={row}
      />
    </>
  );
}
