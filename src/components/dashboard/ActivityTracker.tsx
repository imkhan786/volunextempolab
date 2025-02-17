import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Medal, Target } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  organization: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
}

interface ActivityTrackerProps {
  upcomingEvents?: Event[];
  completedHours?: number;
  totalHours?: number;
  earnedBadges?: Badge[];
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  upcomingEvents = [
    {
      id: "1",
      title: "Beach Cleanup",
      date: "2024-04-15",
      organization: "Ocean Guardians",
    },
    {
      id: "2",
      title: "Food Bank Distribution",
      date: "2024-04-20",
      organization: "Community Food Bank",
    },
  ],
  completedHours = 24,
  totalHours = 50,
  earnedBadges = [
    { id: "1", name: "First Timer", icon: "🌟" },
    { id: "2", name: "Environmental Hero", icon: "🌿" },
    { id: "3", name: "Community Leader", icon: "👥" },
  ],
}) => {
  return (
    <Card className="w-[350px] h-[400px] p-4 bg-white">
      <div className="space-y-6">
        {/* Progress Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress
          </h3>
          <Progress
            value={(completedHours / totalHours) * 100}
            className="h-2"
          />
          <p className="text-sm text-gray-600 mt-2">
            {completedHours} of {totalHours} hours completed
          </p>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </h3>
          <ScrollArea className="h-[100px]">
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium">{event.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600">{event.organization}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Medal className="w-5 h-5" />
            Earned Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge) => (
              <Badge
                key={badge.id}
                variant="secondary"
                className="text-sm py-1 px-3"
              >
                {badge.icon} {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTracker;
