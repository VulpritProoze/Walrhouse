export interface UoMGroupLine {
  uoM: string;
  baseQty: number;
}

export interface UoMGroupDto {
  id: number;
  baseUoM: string;
  uoMGroupLines: UoMGroupLine[];
}

export interface CreateUoMGroupDto {
  baseUoM: string;
  uoMGroupLines: UoMGroupLine[];
}

export interface UpdateUoMGroupDto {
  id: number;
  baseUoM: string;
  uoMGroupLines: UoMGroupLine[];
}
