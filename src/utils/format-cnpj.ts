export function fCnpj(value: string | number | null | undefined): string {
    if (!value) return '';
  
    const raw = value.toString().padStart(14, '0').replace(/\D/g, '');
  
    return raw.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  