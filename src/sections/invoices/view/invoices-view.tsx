import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Icon } from "@iconify/react";
import { DashboardContent } from 'src/layouts/dashboard';
import { InvoicesTableRow } from '../invoices-table-row';
import { InvoicesTableHead } from '../invoices-table-head';
import { TableEmptyRows } from '../invoices-table-empty-rows';
import { InvoicesTableNoData } from '../invoices-table-no-data';
import { InvoicesTableToolbar } from '../invoices-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { getInvoices } from '../../../middleware/apiMiddleware';
import { useTable } from '../../companies/view/companies-view';
import type { InvoicesProps } from '../invoices-table-row';
import * as XLSX from 'xlsx'; // Importando a biblioteca XLSX

export function InvoicesView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [invoices, setInvoices] = useState<InvoicesProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Erro ao buscar faturas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const dataFiltered: InvoicesProps[] = applyFilter({
    inputData: invoices,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // Função para baixar as notas filtradas como um arquivo Excel
  const handleDownload = () => {
    // Converte as notas filtradas para o formato de planilha
    const formattedData = dataFiltered.map((invoice) => ({
      'Número': invoice.invoiceNumber,
      'Empresa': invoice.companyId.description,
      'Data de Emissão': invoice.senderDate,
      'Emissor': invoice.sender,
      'Tomador': invoice.taker,
      'Valor': invoice.amount,
    }));

    // Cria uma planilha com os dados
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notas Fiscais');

    // Baixa o arquivo Excel
    XLSX.writeFile(wb, 'Notas_Fiscais.xlsx');
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Notas Fiscais
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="mdi:download" />}
          onClick={handleDownload} // Adicionando evento para download
        >
          Baixar Notas Filtradas
        </Button>
      </Box>

      <Card>
        <InvoicesTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <InvoicesTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={invoices.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, invoices.map((inv) => inv._id))
              }
              headLabel={[
                { id: 'invoiceNumber', label: 'Número' },
                { id: 'companyId.description', label: 'Empresa' },
                { id: 'senderDate', label: 'Data de Emissão' },
                { id: 'sender', label: 'Emissor' },
                { id: 'taker', label: 'Tomador' },
                { id: 'amount', label: 'Valor' },
                { id: '' },
              ]}
            />
            <TableBody>
              {loading ? (
                <InvoicesTableNoData searchQuery="Carregando..." />
              ) : (
                dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InvoicesTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                    />
                  ))
              )}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, invoices.length)}
              />

              {notFound && <InvoicesTableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          page={table.page}
          count={invoices.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
