import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import React, { useEffect, useState } from "react";

interface ResendTimerProps {
  initialTime: number; // Time in seconds
  onResend: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ResendTimer: React.FC<ResendTimerProps> = ({
  initialTime,
  onResend,
  disabled = false,
  loading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(initialTime > 0);

  useEffect(() => {
    // Update timer state when initialTime changes
    setTimeLeft(initialTime);
    setIsTimerActive(initialTime > 0);
  }, [initialTime]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setIsTimerActive(false);
      }
      return; // Exit if timer is not running
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          setIsTimerActive(false);
        }
        return newTime;
      });
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount or timeLeft change
  }, [timeLeft, isTimerActive]);

  const handleResend = () => {
    if (!isTimerActive && !loading) {
      onResend();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const isDisabled = isTimerActive || disabled || loading;

  return (
    <Button
      variant="link"
      size="sm"
      onPress={handleResend}
      disabled={isDisabled}
      className="p-0 min-h-0"
    >
      <Typography
        variant="body2"
        className={`${isDisabled ? "text-medium" : "text-primary"}`}
      >
        {loading ? "Sending..." : "Resend"}
      </Typography>

      {isTimerActive && timeLeft > 0 && (
        <Typography variant="body2" className="text-primary ml-1">
          {`(${formatTime(timeLeft)})`}
        </Typography>
      )}
    </Button>
  );
};

export default ResendTimer;
