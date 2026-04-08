import { api } from '@/lib/axios';

export interface BatchDto {
    id: string;
    itemCode: string;
    quantity: number;
    receivedDate: string;
    status: string;
}

/**
 * Get all batches for receiving
 */
export const getBatches = async () => await api.get<BatchDto[]>('/api/batches');

/**
 * Get receiving worklist
 */
export const getReceivingWorklist = async () => await api.get<any[]>('/api/receiving/worklist');
