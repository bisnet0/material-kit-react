import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { UserProps } from 'src/sections/companies/user-table-row';
import { fCnpj } from 'src/utils/format-cnpj';

type CompanyDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  company: UserProps | null;
};

export function CompanyDeleteModal({
  open,
  onClose,
  onConfirm,
  company,
}: CompanyDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4, 
        borderRadius: 2 
      }}>
        <Typography variant="h6" component="h2">
          Confirmar Exclusão
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Você tem certeza que deseja excluir a empresa "<strong>{company?.description}</strong>" CNPJ: <strong>{company?.cnpj ? fCnpj(company.cnpj) : ''}</strong>?
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Sim, excluir
          </Button>
          <Button variant="outlined" color="primary" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
