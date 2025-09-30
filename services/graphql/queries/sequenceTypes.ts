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

// Sequence Detail Types
export interface SequentialExercise {
  id: string;
  name: string;
  positionOrder: number;
  repetition: number;
  sets: number;
  shortVersion: string;
  supersetPosition: number;
  time: number;
}

export interface CombinedExerciseItem {
  createdAt: string;
  id: string;
  name: string;
  positionOrder: number;
  repetition: number;
  reps: number;
  sets: number;
  shortVersion: string;
  supersetPosition: number;
  time: number;
  type: string;
  updatedAt: string;
  writtenInstructions: string;
  sequentialExercises: SequentialExercise[];
}

export interface CombinedExerciseItemsData {
  allData: CombinedExerciseItem[];
  count: number;
  nextPage?: number | null;
  prevPage?: number | null;
  totalPages: number;
}

export interface SequenceDetail {
  combinedExerciseItems: CombinedExerciseItemsData;
  practitionerComments?: string | null;
  practitionerCommentsAddedAt?: string | null;
  practitionerCommentsAddedOn?: string | null;
  sequenceTemplateId?: string | null;
  status: string;
  askedForAdminHelp: boolean;
  adminCanUpdate: boolean;
  title: string;
  id: string;
  assessmentId: string;
  createdAt: string;
  practitioner: Practitioner;
  assessmentSequenceOrder: number;
  exerciseCount: number;
  completionCount: number;
}

export interface SequenceDetailData {
  count: number;
  allData: SequenceDetail[];
}

export interface SequenceDetailResponse {
  allSequences: SequenceDetailData;
}

export interface SequenceDetailVariables {
  assessmentId: string;
  assessmentSequenceOrder: number;
  exerciseItemsPage?: number;
  exerciseItemsPerPage?: number;
  status?: string | null;
  dateCreated?: string | null;
  clientId?: string | null;
  practitionerId?: string | null;
  page?: number;
  search?: string | null;
  perPage?: number;
  createdById?: string | null;
}
