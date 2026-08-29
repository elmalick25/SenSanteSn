import { BilanAntro } from './enfant.model';

export interface AlerteMAS {
  id?: number;
  dateAlerte: string;
  message: string;
  acquittee: boolean;
  bilan?: BilanAntro;
}
