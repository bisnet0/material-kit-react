export function fCnpj(value: string | number | null | undefined): string {
  if (!value) return '';

  const raw = value.toString().replace(/\D/g, '');

  // Aplica a máscara dinamicamente conforme o usuário digita
  if (raw.length <= 2)
    return raw;
  if (raw.length <= 5)
    return raw.replace(/^(\d{2})(\d{1,3})/, '$1.$2');
  if (raw.length <= 8)
    return raw.replace(/^(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
  if (raw.length <= 12)
    return raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
  
  return raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, '$1.$2.$3/$4-$5');
}

  