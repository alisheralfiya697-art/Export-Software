import { ESANCHIT_DOCUMENT_CODES } from '../data/e-sanchit-codes.ts';
import { LineItem, ShippingBill, ValidationErrorItem } from './model.ts';

export class ShippingBillService {
  /**
   * Recalculates all values and totals for a Shipping Bill
   */
  static recalculateTotals(sb: ShippingBill): ShippingBill {
    let totalFobInr = 0;
    let totalDrawbackInr = 0;
    let totalRodtepInr = 0;

    // Recalculate each item
    const updatedItems = sb.items.map((item) => {
      const itemTotalValue = Number((item.quantity * item.unitPrice).toFixed(2));
      const invoice = sb.invoices.find((inv) => inv.invoiceNo === item.invoiceNo) || sb.invoices[0];
      const exRate = invoice ? invoice.exchangeRate : 83.5;
      const inrValue = Number((itemTotalValue * exRate).toFixed(2));

      const drawbackAmount = item.drawbackRatePercent > 0
        ? Number(((inrValue * item.drawbackRatePercent) / 100).toFixed(2))
        : 0;

      const rodtepAmount = item.rodtepRatePercent > 0
        ? Number(((inrValue * item.rodtepRatePercent) / 100).toFixed(2))
        : 0;

      totalFobInr += inrValue;
      totalDrawbackInr += drawbackAmount;
      totalRodtepInr += rodtepAmount;

      return {
        ...item,
        itemTotalValue,
        inrValue,
        drawbackAmount,
        rodtepAmount,
      };
    });

    // Update invoice summaries
    const updatedInvoices = sb.invoices.map((inv) => {
      const itemsInInvoice = updatedItems.filter((i) => i.invoiceNo === inv.invoiceNo);
      const invoiceSum = itemsInInvoice.reduce((acc, curr) => acc + curr.itemTotalValue, 0);
      const fobAmount = Math.max(0, invoiceSum - (inv.freightAmount || 0) - (inv.insuranceAmount || 0));
      return {
        ...inv,
        invoiceAmount: Number(invoiceSum.toFixed(2)),
        fobAmount: Number(fobAmount.toFixed(2)),
        inrTotalFob: Number((fobAmount * inv.exchangeRate).toFixed(2)),
      };
    });

    return {
      ...sb,
      items: updatedItems,
      invoices: updatedInvoices,
      totalFobInr: Number(totalFobInr.toFixed(2)),
      totalDrawbackInr: Number(totalDrawbackInr.toFixed(2)),
      totalRodtepInr: Number(totalRodtepInr.toFixed(2)),
    };
  }

  /**
   * Run comprehensive Indian Customs & ICEGATE EDI validation rules
   */
  static validateShippingBill(sb: ShippingBill): ValidationErrorItem[] {
    const errors: ValidationErrorItem[] = [];

    // 1. General & Port Validation
    if (!sb.jobNo?.trim()) {
      errors.push({ field: 'jobNo', section: 'general', message: 'Job number is required for customs tracking.', severity: 'error' });
    }
    if (!sb.portOfLoading?.trim()) {
      errors.push({ field: 'portOfLoading', section: 'general', message: 'Port of Loading (e.g. INNSA1, INDEL4) is required.', severity: 'error' });
    }
    if (!sb.portOfDestination?.trim()) {
      errors.push({ field: 'portOfDestination', section: 'general', message: 'Port of Destination is required.', severity: 'error' });
    }
    if (!sb.countryOfDestination?.trim()) {
      errors.push({ field: 'countryOfDestination', section: 'general', message: 'Country of Destination is required.', severity: 'error' });
    }

    // 2. Exporter & Parties Validation
    const iecRegex = /^[A-Z0-9]{10}$/i;
    if (!sb.exporter.iec || !iecRegex.test(sb.exporter.iec)) {
      errors.push({ field: 'iec', section: 'parties', message: 'Exporter IEC must be exactly 10 alphanumeric characters.', severity: 'error' });
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!sb.exporter.pan || !panRegex.test(sb.exporter.pan)) {
      errors.push({ field: 'pan', section: 'parties', message: 'Exporter PAN must be valid 10-char format (e.g. AAACT1234F).', severity: 'error' });
    }
    if (!sb.exporter.gstin || sb.exporter.gstin.length !== 15) {
      errors.push({ field: 'gstin', section: 'parties', message: 'Exporter GSTIN must be exactly 15 characters.', severity: 'error' });
    }
    const adCodeRegex = /^\d{14}$/;
    if (!sb.exporter.adCode || !adCodeRegex.test(sb.exporter.adCode.replace(/\s+/g, ''))) {
      errors.push({ field: 'adCode', section: 'parties', message: 'Bank Authorised Dealer (AD) Code must be 14 numeric digits registered at customs.', severity: 'error' });
    }
    if (!sb.consignee.name?.trim()) {
      errors.push({ field: 'consigneeName', section: 'parties', message: 'Consignee / Overseas Buyer legal name is required.', severity: 'error' });
    }
    if (!sb.broker.chaLicenseNo?.trim()) {
      errors.push({ field: 'chaLicenseNo', section: 'parties', message: 'Customs Broker / CHA License number is required.', severity: 'warning' });
    }

    // 3. Invoice & Line Items
    if (!sb.invoices || sb.invoices.length === 0) {
      errors.push({ field: 'invoices', section: 'invoices', message: 'At least one export commercial invoice is required.', severity: 'error' });
    }
    if (!sb.items || sb.items.length === 0) {
      errors.push({ field: 'items', section: 'invoices', message: 'Shipping bill must contain at least 1 export line item.', severity: 'error' });
    } else {
      sb.items.forEach((item, idx) => {
        const hsClean = item.hsCode?.replace(/\D/g, '') || '';
        if (hsClean.length !== 8) {
          errors.push({ field: `hsCode_${idx}`, section: 'invoices', message: `Item #${item.itemNo}: HS Code must be exactly 8 digits (Indian ITC-HS).`, severity: 'error' });
        }
        if (item.quantity <= 0) {
          errors.push({ field: `quantity_${idx}`, section: 'invoices', message: `Item #${item.itemNo}: Quantity must be greater than 0.`, severity: 'error' });
        }
        if (item.unitPrice <= 0) {
          errors.push({ field: `unitPrice_${idx}`, section: 'invoices', message: `Item #${item.itemNo}: Unit price must be greater than 0.`, severity: 'error' });
        }
      });
    }

    // 4. Cargo & Containers
    if (sb.cargo.natureOfCargo === 'Containerized') {
      if (!sb.cargo.containers || sb.cargo.containers.length === 0) {
        errors.push({ field: 'containers', section: 'cargo', message: 'Containerized cargo requires at least 1 container with seal details.', severity: 'error' });
      } else {
        sb.cargo.containers.forEach((c, idx) => {
          if (!c.containerNo || c.containerNo.trim().length < 8) {
            errors.push({ field: `container_${idx}`, section: 'cargo', message: `Container #${idx + 1}: Valid Container Number is required (ISO 6346 format).`, severity: 'error' });
          }
          if (!c.sealNo || !c.sealNo.trim()) {
            errors.push({ field: `seal_${idx}`, section: 'cargo', message: `Container #${c.containerNo || idx + 1}: Seal Number is mandatory.`, severity: 'error' });
          }
        });
      }
    }
    if (sb.cargo.grossWeightKg <= 0) {
      errors.push({ field: 'grossWeight', section: 'cargo', message: 'Total Cargo Gross Weight must be greater than 0 KG.', severity: 'error' });
    }

    // 5. e-SANCHIT Document Checks
    const mandatoryDocs = ESANCHIT_DOCUMENT_CODES.filter((d) => d.mandatory);
    mandatoryDocs.forEach((mandDoc) => {
      const found = sb.esanchitDocs?.find((d) => d.docCode === mandDoc.docCode);
      if (!found) {
        errors.push({
          field: `esanchit_${mandDoc.docCode}`,
          section: 'esanchit',
          message: `Mandatory e-SANCHIT doc missing: ${mandDoc.docName} (Code ${mandDoc.docCode}).`,
          severity: 'error',
        });
      } else if (!found.irn || found.irn.length < 8) {
        errors.push({
          field: `esanchit_irn_${mandDoc.docCode}`,
          section: 'esanchit',
          message: `${mandDoc.docName} requires a generated e-SANCHIT IRN before filing.`,
          severity: 'warning',
        });
      }
    });

    return errors;
  }

  /**
   * Generate official ICEGATE 1.5 RES / Flat File content
   */
  static generateIcegateFlatFile(sb: ShippingBill): string {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const lines: string[] = [];

    // Message Header
    lines.push(`HREC^ZZ^${sb.broker.chaPan || 'CHAPAN0000'}^ZZ^ICEGATE^${timestamp}^SB^1.5`);
    lines.push(`TABLE^SB_HEADER`);
    lines.push([
      'SB_HEADER',
      sb.jobNo,
      sb.jobDate,
      sb.portOfLoading,
      sb.sbType,
      sb.exporter.iec,
      sb.exporter.branchCode,
      sb.exporter.gstin,
      sb.exporter.adCode,
      sb.consignee.countryCode,
      sb.portOfDestination,
      sb.totalFobInr.toFixed(2),
      sb.totalDrawbackInr.toFixed(2),
      sb.totalRodtepInr.toFixed(2),
      sb.cargo.natureOfCargo,
      sb.cargo.totalPackages,
      sb.cargo.grossWeightKg,
    ].join('^'));
    lines.push(`TREC^SB_HEADER`);

    // Invoices
    lines.push(`TABLE^SB_INVOICE`);
    sb.invoices.forEach((inv) => {
      lines.push([
        'SB_INVOICE',
        sb.jobNo,
        inv.invoiceNo,
        inv.invoiceDate,
        inv.currency,
        inv.exchangeRate,
        inv.incoterm,
        inv.invoiceAmount,
        inv.freightAmount,
        inv.insuranceAmount,
        inv.fobAmount,
      ].join('^'));
    });
    lines.push(`TREC^SB_INVOICE`);

    // Items
    lines.push(`TABLE^SB_ITEM`);
    sb.items.forEach((item) => {
      lines.push([
        'SB_ITEM',
        sb.jobNo,
        item.invoiceNo,
        item.itemNo,
        item.hsCode,
        item.description.replace(/[\^|\n]/g, ' '),
        item.quantity,
        item.uqc,
        item.unitPrice,
        item.itemTotalValue,
        item.schemeCode,
        item.drawbackRatePercent,
        item.drawbackAmount,
        item.rodtepRatePercent,
        item.rodtepAmount,
      ].join('^'));
    });
    lines.push(`TREC^SB_ITEM`);

    // e-SANCHIT Documents
    lines.push(`TABLE^SB_ESANCHIT`);
    sb.esanchitDocs.forEach((doc) => {
      lines.push([
        'SB_ESANCHIT',
        sb.jobNo,
        doc.docCode,
        doc.drn,
        doc.irn,
        doc.fileName,
        doc.uploadDate,
      ].join('^'));
    });
    lines.push(`TREC^SB_ESANCHIT`);

    // Containers
    if (sb.cargo.containers.length > 0) {
      lines.push(`TABLE^SB_CONTAINER`);
      sb.cargo.containers.forEach((cnt) => {
        lines.push([
          'SB_CONTAINER',
          sb.jobNo,
          cnt.containerNo,
          cnt.size,
          cnt.sealNo,
          cnt.sealType,
          cnt.grossWeightKg,
        ].join('^'));
      });
      lines.push(`TREC^SB_CONTAINER`);
    }

    lines.push(`TREC^ZZ^${sb.broker.chaPan || 'CHAPAN0000'}^ZZ^ICEGATE^${timestamp}^SB^1.5`);

    return lines.join('\n');
  }
}
