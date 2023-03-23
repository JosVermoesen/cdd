export interface DomEntry {
  id: string;
  amount: number;
  endToEndReference: string;
  communication: string;
  mandateId: string;
  mandateStartDate: any;
  clientName: string;
  clientIban: string;
  dummy?: number;
  clientBic?: string;
  clientStreet?: string;
  clientPostalcode?: string;
  clientTown?: string;
  clientCountry?: string;
}
