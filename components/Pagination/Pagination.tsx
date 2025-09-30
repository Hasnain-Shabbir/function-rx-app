import { Button } from "@/components/Button/Button";
import React from "react";
import { Text, View } from "react-native";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  onPageChange: (page: number) => void;
}

const getVisiblePages = (
  current: number,
  total: number
): (number | "...")[] => {
  const delta = 2;
  const range: (number | "...")[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // first page
      i === total || // last page
      (i >= current - delta && i <= current + delta) // around current
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
};

const Pagination = ({
  currentPage,
  totalPages = 1,
  nextPage,
  prevPage,
  onPageChange,
}: TablePaginationProps) => {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <View className="max-w-full">
      <View className="flex-row flex-wrap items-center gap-1 px-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onPress={() => {
            if (prevPage) onPageChange(prevPage);
          }}
          disabled={!prevPage || currentPage === 1}
          className="px-3 py-2"
        >
          <Text className="text-sm font-medium text-gray-500">Prev</Text>
        </Button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <View key={index} className="px-2">
              <Text className="text-sm text-gray-700">...</Text>
            </View>
          ) : (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onPress={() => {
                if (page !== currentPage) onPageChange(Number(page));
              }}
              className={`h-9 w-9 rounded-full px-3 py-2 ${
                page === currentPage
                  ? "bg-primary-500"
                  : "bg-white border border-gray-300"
              }`}
            >
              <Text
                className={`text-sm ${
                  page === currentPage ? "text-white" : "text-gray-700"
                }`}
              >
                {page}
              </Text>
            </Button>
          )
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onPress={() => {
            if (nextPage) onPageChange(nextPage);
          }}
          disabled={!nextPage || currentPage === totalPages}
          className="px-3 py-2"
        >
          <Text className="text-sm font-medium text-gray-500">Next</Text>
        </Button>
      </View>
    </View>
  );
};

export { Pagination };
