import { useState, useEffect, useCallback } from 'react';

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
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { InvoicesTableRow } from '../invoices-table-row';
import { InvoicesTableHead } from '../invoices-table-head';
import { TableEmptyRows } from '../invoices-table-empty-rows';
import { InvoicesTableNoData } from '../invoices-table-no-data';
import { InvoicesTableToolbar } from '../invoices-table-toolbar';

import { emptyRows, applyFilter, getComparator } from '../utils';
import { getInvoices } from '../../../middleware/apiMiddleware';

import { useTable } from '../../companies/view/companies-view';
import type { InvoicesProps } from '../invoices-table-row';

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

        <Scrollbar>
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
        </Scrollbar>

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
