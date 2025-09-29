import {
  CheckmarkCircle,
  NextIcon,
  RepeatIcon,
  WorkoutStretching,
} from "@/assets/icons";

export const stats = [
  {
    id: 1,
    title: "Completed Sequences",
    count: 24,
    icon: CheckmarkCircle,
  },
  {
    id: 2,
    title: "Completed Exercises",
    count: 45,
    icon: WorkoutStretching,
  },
  {
    id: 3,
    title: "Skipped Exercises",
    count: 0,
    icon: NextIcon,
  },
  {
    id: 4,
    title: "Repeated Exercises",
    count: 5,
    icon: RepeatIcon,
  },
];
