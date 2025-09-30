// TypeScript types for sequence queries

export interface SequenceFilterInput {
  status?: string | null;
  dateCreated?: string | null;
  clientId?: string | null;
  practitionerId?: string | null;
  search?: string | null;
  page?: number | null;
  perPage?: number | null;
  assessmentId?: string | null;
  createdById?: string | null;
}

export interface Client {
  id: string;
  imageUrl?: string | null;
  fullName: string;
}

export interface Practitioner {
  imageUrl?: string | null;
  id: string;
  fullName: string;
}

export interface Sequence {
  id: string;
  exerciseCount: number;
  assessmentId: string;
  status: string;
  title: string;
  sequenceTemplateId?: string | null;
  assessmentSequenceOrder: number;
  createdAt: string;
  askedForAdminHelp: boolean;
  adminCanUpdate: boolean;
  client: Client;
  practitioner: Practitioner;
}

export interface AllSequencesData {
  count: number;
  nextPage?: number | null;
  prevPage?: number | null;
  totalPages: number;
  allData: Sequence[];
}

export interface AllSequencesResponse {
  allSequences: AllSequencesData;
}
