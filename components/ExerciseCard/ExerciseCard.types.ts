export interface ExerciseCardProps {
  /**
   * The name/title of the exercise
   */
  name: string;

  /**
   * The number of times this exercise has been performed
   */
  count: number;

  /**
   * Number of sets for this exercise
   */
  sets: number;

  /**
   * Number of reps for this exercise
   */
  reps: number;

  /**
   * Optional image source for the exercise
   * Can be a URI string for remote images or a require() result for local images
   */
  imageSource?: string | number;

  /**
   * Optional background color for the image placeholder
   * Defaults to "bg-primary-200"
   */
  imageBackgroundColor?: string;

  /**
   * Optional callback when the card is pressed
   */
  onPress?: () => void;

  /**
   * Optional custom className for additional styling
   */
  className?: string;
}
