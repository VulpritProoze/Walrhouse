/**
 * Specific DTO for the ScanHistory component display.
 */
export interface VerificationHistoryDto {
  id: number;
  batchNumberVerified: string;
  remarks?: string;
  createdAt: string;
  createdBy?: string;
}
