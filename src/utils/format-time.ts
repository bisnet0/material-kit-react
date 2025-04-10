import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ✔️ Adicionando locale pt-br
import 'dayjs/locale/pt-br';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ✔️ Define o locale padrão como pt-br
dayjs.locale('pt-br');

// ----------------------------------------------------------------------

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

export const formatPatterns = {
  dateTime: 'DD/MM/YYYY HH:mm:ss', // 🆕 Padrão BR 24h
  date: 'DD/MM/YYYY',
  time: 'HH:mm:ss',
  split: {
    dateTime: 'DD/MM/YYYY HH:mm:ss',
    date: 'DD/MM/YYYY',
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY HH:mm:ss',
    date: 'DD-MM-YYYY',
  },
};

const isValidDate = (date: DatePickerFormat) =>
  date !== null && date !== undefined && dayjs(date).isValid();

// ----------------------------------------------------------------------

export function fDateTime(date: DatePickerFormat, template?: string): string {
  if (!isValidDate(date)) {
    return 'Data inválida';
  }

  return dayjs(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

export function fDate(date: DatePickerFormat, template?: string): string {
  if (!isValidDate(date)) {
    return 'Data inválida';
  }

  return dayjs(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

export function fToNow(date: DatePickerFormat): string {
  if (!isValidDate(date)) {
    return 'Data inválida';
  }

  return dayjs(date).toNow(true);
}
