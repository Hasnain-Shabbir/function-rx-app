import { useDebounce } from "@/hooks/useDebounce";
import { ALL_SEQUENCES } from "@/services/graphql/queries/sequencesQueries";
import type {
  AllSequencesResponse,
  Sequence,
  SequenceFilterInput,
} from "@/services/graphql/queries/sequenceTypes";
import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

export const useSequenceData = (enabled: boolean = true) => {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SequenceFilterInput>({
    status: null,
    dateCreated: null,
    clientId: null,
    practitionerId: null,
    search: null,
    page: null,
    perPage: null,
    assessmentId: null,
    createdById: null,
  });

  const { data, loading, error, refetch } = useQuery<
    AllSequencesResponse,
    { filter: SequenceFilterInput }
  >(ALL_SEQUENCES, {
    variables: {
      filter: {
        ...filters,
        search: debouncedKeyword || null,
        page: currentPage,
        perPage: 4,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: !enabled,
  });
  console.log("🚀 ~ useSequenceData ~ data:", data);

  // Handle page reset when data changes
  useEffect(() => {
    if (data) {
      const sequences = data?.allSequences?.allData || [];
      const totalPages = data?.allSequences?.totalPages || 1;

      // If current page is empty and we're not on page 1, redirect to page 1
      if (sequences.length === 0 && currentPage > 1 && totalPages > 0) {
        setCurrentPage(1);
      }
    }
  }, [data, currentPage]);

  const sequences: Sequence[] = data?.allSequences?.allData || [];
  console.log("🚀 ~ useSequenceData ~ sequences:", sequences);
  const totalPages = data?.allSequences?.totalPages || 1;
  const count = data?.allSequences?.count || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: SequenceFilterInput) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return {
    sequences,
    loading,
    error,
    keyword,
    setKeyword: handleKeywordChange,
    currentPage,
    totalPages,
    count,
    filters,
    handlePageChange,
    handleFiltersChange,
    refetch,
  };
};
