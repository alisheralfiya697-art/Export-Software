import { ShippingBillStatus } from '../data/types.ts';

export interface WorkflowStep {
  status: ShippingBillStatus;
  label: string;
  description: string;
  color: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    status: 'draft',
    label: 'Draft',
    description: 'Data entry in progress, missing validation',
    color: 'slate',
  },
  {
    status: 'validated',
    label: 'Rules Validated',
    description: 'Customs schema and tax rules verified',
    color: 'blue',
  },
  {
    status: 'esanchit_pending',
    label: 'e-SANCHIT Pending',
    description: 'Awaiting mandatory document uploads or IRN generation',
    color: 'amber',
  },
  {
    status: 'ready_for_icegate',
    label: 'Ready for ICEGATE',
    description: 'Ready to generate RES flat-file and transmit to Customs Gateway',
    color: 'purple',
  },
  {
    status: 'transmitted',
    label: 'Transmitted to ICEGATE',
    description: 'SB Number allocated, under customs appraisal/examination',
    color: 'indigo',
  },
  {
    status: 'leo_granted',
    label: 'LEO Granted',
    description: 'Let Export Order granted by customs officer; goods cleared for loading',
    color: 'emerald',
  },
  {
    status: 'query_raised',
    label: 'Customs Query Raised',
    description: 'Appraiser requested clarification or additional documentation',
    color: 'rose',
  },
];

export function getWorkflowStepInfo(status: ShippingBillStatus): WorkflowStep {
  return WORKFLOW_STEPS.find((s) => s.status === status) || WORKFLOW_STEPS[0];
}

export function canTransitionTo(currentStatus: ShippingBillStatus, targetStatus: ShippingBillStatus): boolean {
  const flowOrder: ShippingBillStatus[] = [
    'draft',
    'validated',
    'esanchit_pending',
    'ready_for_icegate',
    'transmitted',
    'leo_granted',
  ];

  if (targetStatus === 'query_raised') return currentStatus === 'transmitted';
  if (currentStatus === 'query_raised' && targetStatus === 'transmitted') return true;

  const curIdx = flowOrder.indexOf(currentStatus);
  const tgtIdx = flowOrder.indexOf(targetStatus);

  return tgtIdx >= 0 && (tgtIdx === curIdx + 1 || tgtIdx <= curIdx);
}
