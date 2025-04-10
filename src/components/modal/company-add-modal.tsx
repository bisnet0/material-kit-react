import { useState } from 'react';
import { createCompany } from 'src/middleware/apiMiddleware'; // Importando a função do middleware
import { fCnpj } from 'src/utils/format-cnpj'; // Importando a função de formatação de CNPJ
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
} from '@mui/material';

type CompanyForm = {
    description: string;
    cnpj: string;
    municipalRegistration: string;
    status: string; // 'true' or 'false'
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export function CompanyAddModal({ open, onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState<CompanyForm>({
        description: '',
        cnpj: '',
        municipalRegistration: '',
        status: 'true',
    });

    const handleChange = (field: keyof CompanyForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async () => {
        try {
            await createCompany({
                description: formData.description,
                cnpj: formData.cnpj,
                municipalRegistration: formData.municipalRegistration,
                status: formData.status === 'true',
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Erro ao adicionar empresa:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adicionar Empresa</DialogTitle>
            <DialogContent>
                <Stack spacing={3} mt={1}>
                    <TextField
                        label="Empresa"
                        value={formData.description}
                        onChange={handleChange('description')}
                        fullWidth
                    />
                    <TextField
                        label="CNPJ"
                        fullWidth
                        value={fCnpj(formData.cnpj)}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, ''); // Remove qualquer formatação
                            setFormData({ ...formData, cnpj: raw });
                        }}
                        InputProps={{ inputProps: { maxLength: 18 } }} // limita exibição formatada
                        margin="normal"
                    />
                    <TextField
                        label="Inscrição Municipal"
                        value={formData.municipalRegistration}
                        onChange={handleChange('municipalRegistration')}
                        fullWidth
                        type="number"
                    />
                    <RadioGroup
                        row
                        value={formData.status}
                        onChange={handleChange('status')}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Ativo" />
                        <FormControlLabel value="false" control={<Radio />} label="Inativo" />
                    </RadioGroup>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
