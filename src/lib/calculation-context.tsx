import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CalculationResult {
  success: boolean;
  user: {
    points: number;
    badges: Array<{
      name: string;
      type: string;
      points: number;
      category: string;
      completed: boolean;
      earnedDate?: string;
    }>;
  };
  breakdown: {
    skill: { count: number; points: number; pointsPerBadge: number };
    level: { count: number; points: number; pointsPerBadge: number };
    trivia: { count: number; points: number; pointsPerBadge: number };
    completion: { count: number; points: number; pointsPerBadge: number };
  };
  summary: {
    skillBadges: number;
    levelBadges: number;
    triviaBadges: number;
    completionBadges: number;
    totalPoints: number;
  };
}

interface CalculationContextType {
  calculationResult: CalculationResult | null;
  setCalculationResult: (result: CalculationResult | null) => void;
  profileUrl: string;
  setProfileUrl: (url: string) => void;
  isCalculating: boolean;
  setIsCalculating: (calculating: boolean) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export function CalculationProvider({ children }: { children: ReactNode }) {
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  return (
    <CalculationContext.Provider
      value={{
        calculationResult,
        setCalculationResult,
        profileUrl,
        setProfileUrl,
        isCalculating,
        setIsCalculating,
      }}
    >
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculation() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
} 