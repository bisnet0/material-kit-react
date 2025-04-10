import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { getInvoicesDownloads } from 'src/middleware/apiMiddleware'; // Importando a função do middleware

import type { CardProps } from '@mui/material/Card';

import { fLongDate, fHour } from 'src/utils/format-time'; // já tem no seu projeto!

type DownloadItem = {
  _id: string;
  downloadDate: string;
};

type ApiResponse = {
  nfeDownloads: DownloadItem[];
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

export function AnalyticsLastDownloads({ title = 'Últimos Downloads', subheader, sx, ...other }: Props) {
  const theme = useTheme();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const data: ApiResponse[] = await getInvoicesDownloads(); // Usando o middleware
        const allDownloads = data?.[0]?.nfeDownloads ?? [];
        setDownloads(allDownloads.slice(0, 6)); // Pega os 6 mais recentes
      } catch (err) {
        console.error('Erro ao buscar últimos downloads:', err);
      }
    };
  
    fetchDownloads();
  }, []);

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {downloads.map((item) => (
          <Box
            key={item._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 1,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: theme.palette.background.neutral,
            }}
          >
            <Box>
              <Typography variant="subtitle1">{fLongDate(item.downloadDate)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {fHour(item.downloadDate)}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: 'warning.main',
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
