import { SEQUENCE_DETAIL } from "@/services/graphql/queries/sequencesQueries";
import type {
  CombinedExerciseItem,
  SequenceDetail,
  SequenceDetailResponse,
  SequenceDetailVariables,
} from "@/services/graphql/queries/sequenceTypes";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

export const useSequenceDetail = (
  assessmentId: string,
  assessmentSequenceOrder: number,
  enabled: boolean = true
) => {
  const [version, setVersion] = useState<"long" | "short">("long");
  const [exerciseItemsPage, setExerciseItemsPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<
    SequenceDetailResponse,
    SequenceDetailVariables
  >(SEQUENCE_DETAIL, {
    variables: {
      assessmentId,
      assessmentSequenceOrder,
      exerciseItemsPage,
      exerciseItemsPerPage: 10,
      page: 1,
      perPage: 1,
    },
    fetchPolicy: "cache-and-network",
    skip: !enabled || !assessmentId || !assessmentSequenceOrder,
  });

  const sequenceDetail: SequenceDetail | null =
    data?.allSequences?.allData?.[0] || null;
  const exerciseItems: CombinedExerciseItem[] =
    sequenceDetail?.combinedExerciseItems?.allData || [];
  const totalExercisePages =
    sequenceDetail?.combinedExerciseItems?.totalPages || 1;

  // Filter exercises based on version
  const filteredExerciseItems = exerciseItems.map((item) => {
    if (item.type === "superset") {
      return {
        ...item,
        sequentialExercises: item.sequentialExercises.map((exercise) => ({
          ...exercise,
          instructions:
            version === "long" ? exercise.shortVersion : exercise.shortVersion,
        })),
      };
    } else {
      return {
        ...item,
        instructions:
          version === "long" ? item.writtenInstructions : item.shortVersion,
      };
    }
  });

  const handleVersionChange = (newVersion: "long" | "short") => {
    setVersion(newVersion);
  };

  const handleExercisePageChange = (page: number) => {
    setExerciseItemsPage(page);
  };

  const getExerciseInstructions = (item: CombinedExerciseItem) => {
    if (item.type === "superset") {
      return item.sequentialExercises[0]?.shortVersion || "";
    }
    return version === "long" ? item.writtenInstructions : item.shortVersion;
  };

  const getExerciseMetrics = (item: CombinedExerciseItem) => {
    if (item.type === "superset") {
      return {
        sets: item.sequentialExercises[0]?.sets || 0,
        reps: item.reps || 0,
        time: item.sequentialExercises[0]?.time || 0,
      };
    }
    return {
      sets: item.sets || 0,
      reps: item.reps || 0,
      time: item.time || 0,
    };
  };

  return {
    sequenceDetail,
    exerciseItems: filteredExerciseItems,
    loading,
    error,
    version,
    exerciseItemsPage,
    totalExercisePages,
    handleVersionChange,
    handleExercisePageChange,
    getExerciseInstructions,
    getExerciseMetrics,
    refetch,
  };
};
