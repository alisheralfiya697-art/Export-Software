/**
 * Shipping Marks and Package Numbers generation and standard formats
 */

export interface PackageMarkTemplate {
  id: string;
  label: string;
  template: (data: {
    exporterName: string;
    consigneeName: string;
    destinationPort: string;
    invoiceNo: string;
    packageCount: number;
    grossWeight: number;
  }) => string;
}

export const STANDARD_MARK_TEMPLATES: PackageMarkTemplate[] = [
  {
    id: 'standard-sea',
    label: 'Standard Ocean Freight Shipping Mark',
    template: ({ exporterName, consigneeName, destinationPort, invoiceNo, packageCount, grossWeight }) => {
      return [
        `M/S ${consigneeName.toUpperCase().slice(0, 30)}`,
        `PORT OF DESTINATION: ${destinationPort}`,
        `EXP: ${exporterName.toUpperCase().slice(0, 30)}`,
        `INV NO: ${invoiceNo}`,
        `TOTAL PKGS: 1 TO ${packageCount}`,
        `GROSS WT: ${grossWeight} KGS`,
        `MADE IN INDIA`,
      ].join('\n');
    },
  },
  {
    id: 'air-express',
    label: 'Air Cargo Express Mark',
    template: ({ consigneeName, destinationPort, invoiceNo, packageCount }) => {
      return [
        `AIR FREIGHT: ${destinationPort}`,
        `C/NO: 1-${packageCount}`,
        `INV: ${invoiceNo}`,
        `CONSIGNEE: ${consigneeName.slice(0, 25)}`,
        `ORIGIN: INDIA`,
      ].join(' / ');
    },
  },
  {
    id: 'textile-garment',
    label: 'Apparel & Garment Carton Mark',
    template: ({ exporterName, consigneeName, invoiceNo, packageCount }) => {
      return [
        `STYLE / PO: AS PER INVOICE ${invoiceNo}`,
        `BUYER: ${consigneeName}`,
        `SUPPLIER: ${exporterName}`,
        `CTN NO: 1/${packageCount}`,
        `COUNTRY OF ORIGIN: INDIA`,
      ].join('\n');
    },
  },
];

export function generateShippingMark(templateId: string, data: {
  exporterName: string;
  consigneeName: string;
  destinationPort: string;
  invoiceNo: string;
  packageCount: number;
  grossWeight: number;
}): string {
  const t = STANDARD_MARK_TEMPLATES.find((x) => x.id === templateId) || STANDARD_MARK_TEMPLATES[0];
  return t.template(data);
}
