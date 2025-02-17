import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin, Users, ArrowRight } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  participants: number;
  tags: string[];
  description: string;
}

interface SmartMatchingSectionProps {
  opportunities?: Opportunity[];
  onSignUp?: (opportunityId: string) => void;
}

const defaultOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Community Garden Project",
    organization: "Green Earth Initiative",
    location: "Central Park",
    date: "Next Saturday, 9:00 AM",
    participants: 12,
    tags: ["Environment", "Gardening", "Community"],
    description:
      "Help us maintain and grow our community garden. No experience necessary!",
  },
  {
    id: "2",
    title: "Food Bank Distribution",
    organization: "Local Food Bank",
    location: "Downtown Community Center",
    date: "Every Tuesday, 2:00 PM",
    participants: 8,
    tags: ["Food Security", "Community Service"],
    description: "Assist in sorting and distributing food to families in need.",
  },
  {
    id: "3",
    title: "Senior Tech Support",
    organization: "Digital Literacy Foundation",
    location: "Senior Living Center",
    date: "Weekdays, Flexible Hours",
    participants: 5,
    tags: ["Technology", "Education", "Seniors"],
    description:
      "Help seniors learn to use modern technology and stay connected.",
  },
];

const SmartMatchingSection = ({
  opportunities = defaultOpportunities,
  onSignUp = (id: string) => {},
}: SmartMatchingSectionProps) => {
  return (
    <div className="w-[750px] h-[600px] bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Matched Opportunities</h2>
        <p className="text-gray-600">
          Personalized volunteer opportunities based on your interests
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600">{opportunity.organization}</p>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{opportunity.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{opportunity.participants} volunteers needed</span>
                    </div>
                  </div>

                  <p className="text-gray-700">{opportunity.description}</p>

                  <div className="flex gap-2">
                    {opportunity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="flex items-center gap-2"
                  onClick={() => onSignUp(opportunity.id)}
                  disabled={opportunity.signedUp}
                >
                  {opportunity.signedUp ? "Signed Up" : "Quick Sign-up"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SmartMatchingSection;
