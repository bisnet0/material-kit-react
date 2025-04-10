import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { fCnpj } from 'src/utils/format-cnpj';
import { getCompanies } from '../../middleware/apiMiddleware';

import type { CardProps } from '@mui/material/Card';

type Company = {
  _id: string;
  description: string;
  cnpj: number;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

export function AnalyticsMyCompanies({ title = 'Minhas Empresas', subheader, sx, ...other }: Props) {
  const theme = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      setLoading(true);
      try {
        const data = await getCompanies(); // Chama o middleware para pegar os dados
        const latestCompanies = data.slice(-6); // Pega os 6 últimos elementos
        setCompanies(latestCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompaniesData();
  }, []);
  

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {companies.map((company) => (
          <Box
            key={company._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              px: 1,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: theme.palette.background.neutral,
            }}
          >
            <Box>
              <Typography variant="subtitle1">{company.description}</Typography>
                <Typography variant="caption" color="text.secondary">
                CNPJ: {fCnpj(company.cnpj)}
                </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: 'success.main',
                color: 'common.white',
                px: 1.2,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 700,
                minWidth: 36,
                textAlign: 'center',
              }}
            >
              {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

