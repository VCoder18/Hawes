import { createContext, useContext, useState, ReactNode } from 'react';

// Définition du type pour les données du voyage
interface TripContextType {
  scope: 'public' | 'private';
  setScope: (scope: 'public' | 'private') => void;
  // Tu pourras ajouter d'autres champs ici plus tard (destination, dates, etc.)
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [scope, setScope] = useState<'public' | 'private'>('public');

  return (
    <TripContext.Provider value={{ scope, setScope }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within a TripProvider');
  return context;
};