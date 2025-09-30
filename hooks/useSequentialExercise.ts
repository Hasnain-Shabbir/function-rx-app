import { FETCH_SEQUENTIAL_EXERCISE } from "@/services/graphql/queries/sequencesQueries";
import { useQuery } from "@apollo/client/react";

interface FetchSequentialExerciseResponse {
  fetchSequentialExercise: any;
}

export const useSequentialExercise = (exerciseId: string | null) => {
  const { data, loading, error } = useQuery<FetchSequentialExerciseResponse>(
    FETCH_SEQUENTIAL_EXERCISE,
    {
      variables: { fetchSequentialExerciseId: exerciseId },
      skip: !exerciseId,
    }
  );

  return {
    data: data?.fetchSequentialExercise,
    loading,
    error,
  };
};
