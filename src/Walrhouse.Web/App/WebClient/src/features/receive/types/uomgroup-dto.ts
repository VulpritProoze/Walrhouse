export interface UoMGroupLine {
  uoMName: string;
  baseQty: number;
}

export interface UoMGroupDto {
  id: number;
  baseUoMName: string;
  uoMGroupLines: UoMGroupLine[];
}

export interface CreateUoMGroupDto {
  baseUoMName: string;
  uoMGroupLines: UoMGroupLine[];
}

export interface UpdateUoMGroupDto {
  id: number;
  baseUoMName: string;
  uoMGroupLines: UoMGroupLine[];
}
