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
import { CompanyDeleteModal } from 'src/components/modal/company-delete-modal'; // Novo modal para confirmação de exclusão
import { deleteCompany } from '../../middleware/apiMiddleware'; // Importando a função de exclusão

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
  onUpdated: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onUpdated }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<UserProps | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
    handleClosePopover();
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenDeleteModal = (company: UserProps) => {
    setCompanyToDelete(company);
    setOpenDeleteModal(true);
    handleClosePopover();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleDeleteCompany = async () => {
    if (companyToDelete) {
      try {
        await deleteCompany(companyToDelete._id); // Chama a função de exclusão
        console.log(`Empresa ${companyToDelete.description} excluída!`);
        handleCloseDeleteModal();
        onUpdated(); // Dispara a atualização na lista após exclusão
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
      }
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

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

          <MenuItem onClick={() => handleOpenDeleteModal(row)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </Popover>

      <CompanyEditModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={() => {
          handleCloseEditModal();
          onUpdated();
        }}
        company={row}
      />

      <CompanyDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCompany}
        company={companyToDelete}
      />
    </>
  );
}
