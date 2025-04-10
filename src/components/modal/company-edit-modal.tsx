import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { fCnpj } from 'src/utils/format-cnpj';
import { updateCompany } from 'src/middleware/apiMiddleware';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: {
    _id: string;
    description: string;
    cnpj: number;
    municipalRegistration: number;
    status: boolean;
  };
};

export function CompanyEditModal({ open, onClose, onSuccess, company }: Props) {
  const [description, setDescription] = useState('');
  const [cnpjFormatted, setCnpjFormatted] = useState('');
  const [cnpjRaw, setCnpjRaw] = useState<number>(0);
  const [municipalRegistration, setMunicipalRegistration] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (company) {
      setDescription(company.description);
      setCnpjRaw(company.cnpj);
      setCnpjFormatted(fCnpj(company.cnpj));
      setMunicipalRegistration(company.municipalRegistration);
      setStatus(company.status);
    }
  }, [company]);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
    setCnpjRaw(Number(raw));
    setCnpjFormatted(fCnpj(raw));
  };

  const handleSubmit = async () => {
    try {
      await updateCompany(company._id, {
        description,
        cnpj: cnpjRaw,
        municipalRegistration,
        status,
      });
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Empresa</DialogTitle>
      <DialogContent>
        <TextField label="Empresa" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
        <TextField label="CNPJ" value={cnpjFormatted} onChange={handleCnpjChange} fullWidth margin="normal" />
        <TextField label="Inscrição Municipal" value={municipalRegistration} onChange={(e) => setMunicipalRegistration(Number(e.target.value))} fullWidth margin="normal" />
        <RadioGroup row value={status ? 'ativo' : 'inativo'} onChange={(e) => setStatus(e.target.value === 'ativo')}>
          <FormControlLabel value="ativo" control={<Radio />} label="Ativo" />
          <FormControlLabel value="inativo" control={<Radio />} label="Inativo" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
