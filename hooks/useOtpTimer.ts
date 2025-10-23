import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";

interface UseOtpTimerProps {
  isAdminRoute?: boolean;
}

const useOtpTimer = ({ isAdminRoute = false }: UseOtpTimerProps) => {
  const [timerKey, setTimerKey] = useState("");
  const [initialTime, setInitialTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear interval helper
  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Remove timer from SecureStore
  const removeTimerFromStorage = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
      await SecureStore.deleteItemAsync(`${key}_timestamp`);
    } catch (error) {
      console.error("Error removing timer from storage:", error);
    }
  };

  // Start timer interval
  const startTimerInterval = async (key: string) => {
    clearTimerInterval();

    intervalRef.current = setInterval(async () => {
      try {
        const currentTime = await SecureStore.getItemAsync(key);
        const timestamp = await SecureStore.getItemAsync(`${key}_timestamp`);

        if (currentTime && timestamp) {
          const elapsed = Math.floor((Date.now() - parseInt(timestamp)) / 1000);
          const remainingTime = 60 - elapsed;

          if (remainingTime > 0) {
            await SecureStore.setItemAsync(key, remainingTime.toString());
            setInitialTime(remainingTime);
          } else {
            // Timer has ended - clean up and stop
            await removeTimerFromStorage(key);
            setInitialTime(0);
            clearTimerInterval();
            // Don't restart the timer automatically
          }
        } else {
          // No timer data found, stop the interval
          clearTimerInterval();
        }
      } catch (error) {
        console.error("Error updating timer:", error);
        clearTimerInterval();
      }
    }, 1000);
  };

  // Calculate remaining time from storage
  const calculateRemainingTime = async (key: string) => {
    try {
      const storedTime = await SecureStore.getItemAsync(key);
      const storedTimestamp = await SecureStore.getItemAsync(
        `${key}_timestamp`
      );

      if (storedTime && storedTimestamp) {
        const elapsed = Math.floor(
          (Date.now() - parseInt(storedTimestamp)) / 1000
        );
        const remainingTime = parseInt(storedTime) - elapsed;
        return remainingTime > 0 ? remainingTime : 0;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating remaining time:", error);
      return 0;
    }
  };

  // Initialize timer on mount - only restore existing timer, don't start new one
  useEffect(() => {
    const initializeTimer = async () => {
      const key = isAdminRoute ? "otp_timer_admin" : "otp_timer_simple";
      setTimerKey(key);

      const remainingTime = await calculateRemainingTime(key);

      if (remainingTime > 0) {
        setInitialTime(remainingTime);
        await startTimerInterval(key);
      } else {
        setInitialTime(0);
        await removeTimerFromStorage(key);
      }
    };

    initializeTimer();

    return () => {
      clearTimerInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminRoute]);

  // Handle app state change (when app comes to foreground)
  useEffect(() => {
    const handleAppStateChange = async () => {
      if (timerKey) {
        const remainingTime = await calculateRemainingTime(timerKey);

        if (remainingTime > 0) {
          setInitialTime(remainingTime);
        } else {
          setInitialTime(0);
          await removeTimerFromStorage(timerKey);
        }
      }
    };

    // Note: In React Native, we would typically use AppState for this
    // For now, we'll handle it through the component lifecycle
    handleAppStateChange();
  }, [timerKey]);

  // Reset and start timer - only call this after successful backend response
  const resetTimer = async () => {
    try {
      const key = isAdminRoute ? "otp_timer_admin" : "otp_timer_simple";

      // Set timer to 60 seconds
      await SecureStore.setItemAsync(key, "60");
      await SecureStore.setItemAsync(`${key}_timestamp`, Date.now().toString());

      setInitialTime(60);
      await startTimerInterval(key);
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  };

  // Start first timer - call this when component mounts and OTP is sent
  const startFirstTimer = async () => {
    try {
      const key = isAdminRoute ? "otp_timer_admin" : "otp_timer_simple";

      // Set timer to 60 seconds
      await SecureStore.setItemAsync(key, "60");
      await SecureStore.setItemAsync(`${key}_timestamp`, Date.now().toString());

      setInitialTime(60);
      await startTimerInterval(key);
    } catch (error) {
      console.error("Error starting first timer:", error);
    }
  };

  return {
    timerKey,
    initialTime,
    resetTimer,
    startFirstTimer,
  };
};

export default useOtpTimer;
