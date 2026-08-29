import { Enfant } from './enfant.model';

export interface SupleNutritionnel {
  id?: number;
  type: string;
  quantiteStock: number;
  dateDistribution?: string;
  enfant?: Enfant;
}
