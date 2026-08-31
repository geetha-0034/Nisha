import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Destination, SafetySession, Incident, NotificationLog, Evidence, TrustedContact } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  isMockFallback?: boolean;
}

export interface SafetyContextType {
  coords: Coordinates;
  locationPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  isLocating: boolean;
  activeSession: SafetySession | null;
  activeIncident: Incident | null;
  destinations: Destination[];
  selectedDestination: Destination | null;
  isLoadingDestinations: boolean;
  loadingDestinations: boolean;
  sosActive: boolean;
  notifications: NotificationLog[];
  contacts: TrustedContact[];
  error: string | null;
  requestLocation: () => Promise<Coordinates>;
  requestLocationPermission: () => Promise<Coordinates>;
  fetchDestinations: (lat?: number, lng?: number) => Promise<Destination[]>;
  refreshDestinations: (lat?: number, lng?: number) => Promise<Destination[]>;
  setSelectedDestination: (dest: Destination | null) => void;
  selectDestination: (dest: Destination | null) => void;
  startSession: (destination?: Destination) => Promise<void>;
  startSafetyMode: (destination?: Destination) => Promise<void>;
  startNavigation: (destination?: Destination) => Promise<void>;
  updateUserLocation: (lat: number, lng: number) => Promise<void>;
  triggerSOS: () => Promise<void>;
  endSession: (status?: 'Completed' | 'Cancelled', notes?: string) => Promise<Incident | undefined>;
  endSafetySession: (status?: 'Completed' | 'Cancelled', notes?: string) => Promise<Incident | undefined>;
  attachEvidence: (type: 'image' | 'audio' | 'note', dataBase64?: string, caption?: string) => Promise<Evidence>;
  refreshActiveSession: () => Promise<void>;
  refreshContacts: () => Promise<void>;
  clearError: () => void;
}

const DEFAULT_COORDS: Coordinates = {
  lat: 12.9716,
  lng: 77.5946,
  accuracy: 15,
  isMockFallback: true,
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [coords, setCoords] = useState<Coordinates>(DEFAULT_COORDS);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [activeSession, setActiveSession] = useState<SafetySession | null>(null);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check initial permission status if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          setLocationPermission(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            setLocationPermission(permissionStatus.state as any);
          };
        })
        .catch(() => {
          // Ignored
        });
    } else if (typeof window !== 'undefined' && !('geolocation' in navigator)) {
      setLocationPermission('unsupported');
    }
  }, []);

  // Request high-accuracy user location
  const requestLocation = useCallback(async (): Promise<Coordinates> => {
    setIsLocating(true);
    setError(null);

    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        setLocationPermission('unsupported');
        setIsLocating(false);
        resolve(DEFAULT_COORDS);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isMockFallback: false,
          };
          setCoords(userCoords);
          setLocationPermission('granted');
          setIsLocating(false);
          resolve(userCoords);
        },
        (geoError) => {
          console.warn('Geolocation failed or denied, using simulated reference position:', geoError.message);
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setLocationPermission('denied');
          }
          setIsLocating(false);
          resolve(DEFAULT_COORDS);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  }, []);

  // Fetch trusted contacts
  const refreshContacts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getContacts();
      setContacts(res.contacts || []);
    } catch (err) {
      console.warn('Error fetching contacts:', err);
    }
  }, [isAuthenticated]);

  // Fetch ranked destinations
  const fetchDestinations = useCallback(
    async (lat?: number, lng?: number): Promise<Destination[]> => {
      setIsLoadingDestinations(true);
      setError(null);
      const queryLat = lat !== undefined ? lat : coords.lat;
      const queryLng = lng !== undefined ? lng : coords.lng;

      try {
        const data = await api.getDestinations(queryLat, queryLng);
        setDestinations(data.destinations || []);
        if (data.destinations && data.destinations.length > 0 && !selectedDestination) {
          setSelectedDestination(data.destinations[0]);
        }
        return data.destinations || [];
      } catch (err: any) {
        setError(err.message || 'Failed to search for nearby safe destinations');
        return [];
      } finally {
        setIsLoadingDestinations(false);
      }
    },
    [coords.lat, coords.lng, selectedDestination]
  );

  // Refresh active safety session
  const refreshActiveSession = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getActiveSession();
      setActiveSession(data.session);
      setActiveIncident(data.incident);
      if (data.session) {
        setSosActive(data.session.sosActive);
      } else {
        setSosActive(false);
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshActiveSession();
      refreshContacts();
    } else {
      setActiveSession(null);
      setActiveIncident(null);
      setSosActive(false);
      setContacts([]);
    }
  }, [isAuthenticated, refreshActiveSession, refreshContacts]);

  // Start Safety Mode Session
  const startSession = async (dest?: Destination) => {
    setError(null);
    const targetDest = dest || selectedDestination;

    try {
      const liveCoords = await requestLocation();
      const res = await api.startSafetySession({
        latitude: liveCoords.lat,
        longitude: liveCoords.lng,
        destinationId: targetDest?.id,
        destinationName: targetDest?.name,
        destinationType: targetDest?.type,
        destinationLatitude: targetDest?.latitude,
        destinationLongitude: targetDest?.longitude,
      });

      setActiveSession(res.session);
      setActiveIncident(res.incident);
      setSosActive(res.session.sosActive);
      if (targetDest) {
        setSelectedDestination(targetDest);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start safety session');
      throw err;
    }
  };

  // Update user location during active navigation
  const updateUserLocation = async (lat: number, lng: number) => {
    setCoords({ lat, lng, isMockFallback: false });
    if (activeSession) {
      try {
        const res = await api.updateSessionLocation(lat, lng);
        setActiveSession(res.session);
      } catch (err) {
        console.warn('Could not update live session coords on server:', err);
      }
    }
  };

  // Trigger SOS
  const triggerSOS = async () => {
    setError(null);
    try {
      const res = await api.triggerSOS({
        latitude: coords.lat,
        longitude: coords.lng,
        destinationName: selectedDestination?.name || activeSession?.recommendedDestination,
      });

      setActiveSession(res.session);
      setActiveIncident(res.incident);
      setSosActive(true);
      setNotifications(res.notificationLogs || []);
    } catch (err: any) {
      setError(err.message || 'Emergency SOS dispatch failed');
      throw err;
    }
  };

  // End Session
  const endSession = async (status: 'Completed' | 'Cancelled' = 'Completed', notes?: string) => {
    setError(null);
    try {
      const res = await api.endSafetySession({ status, notes });
      setActiveSession(null);
      setSosActive(false);
      return res.incident;
    } catch (err: any) {
      setError(err.message || 'Failed to conclude safety session');
      throw err;
    }
  };

  // Attach Evidence
  const attachEvidence = async (type: 'image' | 'audio' | 'note', dataBase64?: string, caption?: string): Promise<Evidence> => {
    if (!activeIncident && !activeSession) {
      throw new Error('No active incident to associate evidence with.');
    }
    const incidentId = activeIncident?.id || activeSession?.incidentId!;
    const res = await api.attachEvidence(incidentId, {
      type,
      dataBase64,
      caption,
      latitude: coords.lat,
      longitude: coords.lng,
    });

    // Refresh active incident
    await refreshActiveSession();
    return res.evidence;
  };

  const clearError = () => setError(null);

  return (
    <SafetyContext.Provider
      value={{
        coords,
        locationPermission,
        isLocating,
        activeSession,
        activeIncident,
        destinations,
        selectedDestination,
        isLoadingDestinations,
        loadingDestinations: isLoadingDestinations,
        sosActive,
        notifications,
        contacts,
        error,
        requestLocation,
        requestLocationPermission: requestLocation,
        fetchDestinations,
        refreshDestinations: fetchDestinations,
        setSelectedDestination,
        selectDestination: setSelectedDestination,
        startSession,
        startSafetyMode: startSession,
        startNavigation: startSession,
        updateUserLocation,
        triggerSOS,
        endSession,
        endSafetySession: endSession,
        attachEvidence,
        refreshActiveSession,
        refreshContacts,
        clearError,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = (): SafetyContextType => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
