import { Box, Card, CardHeader, Divider, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FileDownload as FileDownloadIcon, Receipt as ReceiptIcon, Business as BusinessIcon } from '@mui/icons-material';

// Componente de Ações Rápidas dentro de um Card
export function QuickActionsCard({ title = 'Ações Rápidas', subheader }: { title?: string, subheader?: string }) {
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: '24px', // Define a altura do retângulo
                backgroundColor: 'primary.main',
                borderRadius: '4px',
                mr: 2, // Espaço entre o retângulo e o título
              }}
            />
            <Typography variant="h5">{title}</Typography>
          </Box>
        }
        subheader={subheader}
      />

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Link 1 - Baixar as Notas de Ontem */}
        <Link
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1,
          }}
        >
          <FileDownloadIcon sx={{ color: 'primary.main' }} /> {/* Ícone com cor primária */}
          <Typography variant="body2">Baixar as Notas de Ontem</Typography>
        </Link>

        {/* Link 2 - Ver Notas Fiscais Baixadas */}
        <Link
          component={RouterLink}
          to="/invoices"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1,
          }}
        >
          <ReceiptIcon sx={{ color: 'primary.main' }} /> {/* Ícone com cor primária */}
          <Typography variant="body2">Ver Notas Fiscais Baixadas</Typography>
        </Link>

        {/* Link 3 - Cadastrar uma Empresa */}
        <Link
          component={RouterLink}
          to="/companies"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1,
          }}
        >
          <BusinessIcon sx={{ color: 'primary.main' }} /> {/* Ícone com cor primária */}
          <Typography variant="body2">Cadastrar uma Empresa</Typography>
        </Link>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}
