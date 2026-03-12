import { useState, useCallback } from "react";
import { findNearestLocation, NigerianLocation } from "@/lib/nigeria-insolation";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: NigerianLocation | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: "Geolocation not supported", location: null });
      return;
    }

    setState({ loading: true, error: null, location: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestLocation(pos.coords.latitude, pos.coords.longitude);
        if (nearest) {
          setState({ loading: false, error: null, location: nearest });
        } else {
          setState({ loading: false, error: "Location not in Nigeria", location: null });
        }
      },
      (err) => {
        setState({ loading: false, error: err.message, location: null });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  return { ...state, detect };
}
