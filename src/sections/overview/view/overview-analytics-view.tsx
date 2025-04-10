'use client';

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { getInvoicesDownloads } from 'src/middleware/apiMiddleware';
import { fHour } from 'src/utils/format-time';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsMyCompanies } from '../analytics-my-companies'; // corrigido o caminho
import { AnalyticsLastDownloads } from '../analytics-last-downloads';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [downloadsData, setDownloadsData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoicesDownloads();
        setDownloadsData(data[0]); // assumindo que sempre tem ao menos 1
      } catch (error) {
        console.error('Erro ao carregar dados de downloads:', error);
      }
    };

    fetchData();
  }, []);

  if (!downloadsData) {
    return <Typography variant="h6">Carregando dados...</Typography>;
  }

  const lastDownloadDate = downloadsData.lastDownloads?.[0]?.downloadDate
    ? fHour(downloadsData.lastDownloads[0].downloadDate)
    : 'Sem dados';

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Notas Fiscais Baixadas"
            total={downloadsData.totalNfe}
            icon={<img alt="Notas Fiscais Baixadas" src="/assets/icons/glass/ic-glass-invoices.svg" style={{ width: 40, height: 40 }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              series: [10, 20, 15, 30, 25, 10], // fictício
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Média de Downloads por Dia"
            total={downloadsData.averageDownloadsPerDay + "/dia"}
            color="secondary"
            icon={
              <img
                alt="Média de Downloads"
                src="/assets/icons/glass/ic-glass-down.svg"
                style={{ width: 40, height: 40 }} // Alterando o tamanho do ícone
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              series: [5, 10, 7, 12, 8, 10], // fictício
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Último Download Automático"
            total={"Hoje às " + lastDownloadDate}
            color="warning"
            icon={<img alt="Último download Automático" src="/assets/icons/glass/ic-glass-watch.svg" style={{ width: 40, height: 40 }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              series: [1, 2, 1, 3, 2, 1], // fictício
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsMyCompanies />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsLastDownloads />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
