// Custom hook for timezone detection following SRP
import { useState, useEffect } from 'react';
import { DateUtils } from '../utils/DateUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';

export const useTimezone = () => {
  const [tzOffset, setTzOffset] = useState<number | undefined>(undefined);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const offset = DateUtils.getTimezoneOffset();
          setTzOffset(offset);
        },
        () => setTzOffset(undefined),
        APP_CONSTANTS.TIMEZONE_DETECTION_OPTIONS
      );
    }
  }, []);

  return tzOffset;
};
