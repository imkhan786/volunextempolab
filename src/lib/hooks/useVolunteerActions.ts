import { useState } from "react";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  participants: number;
  tags: string[];
  description: string;
  signedUp?: boolean;
}

export const useVolunteerActions = (initialOpportunities?: Opportunity[]) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    initialOpportunities || [],
  );

  const signUpForOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opportunity) =>
        opportunity.id === id
          ? { ...opportunity, signedUp: true }
          : opportunity,
      ),
    );
  };

  return {
    opportunities,
    signUpForOpportunity,
  };
};
