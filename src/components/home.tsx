import React from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import SmartMatchingSection from "./dashboard/SmartMatchingSection";
import ActivityTracker from "./dashboard/ActivityTracker";
import CalendarWidget from "./dashboard/CalendarWidget";
import NotificationCenter from "./dashboard/NotificationCenter";
import QuickFilters from "./dashboard/QuickFilters";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
}

import { useNotifications } from "@/lib/hooks/useNotifications";

import { useVolunteerActions } from "@/lib/hooks/useVolunteerActions";

const Home = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: HomeProps) => {
  const { notifications, markAsRead, dismissNotification } = useNotifications([
    {
      id: "1",
      title: "New Volunteer Opportunity Match",
      message:
        "A new opportunity matching your skills has been found at Local Food Bank",
      type: "match",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Event Update",
      message: "Beach Cleanup event has been rescheduled to next Saturday",
      type: "update",
      timestamp: "1 day ago",
      read: false,
    },
  ]);

  const { opportunities, signUpForOpportunity } = useVolunteerActions([
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
      description:
        "Assist in sorting and distributing food to families in need.",
    },
  ]);
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userName={userName}
        userAvatar={userAvatar}
        notificationCount={3}
      />

      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Quick Filters */}
          <QuickFilters
            onFilterChange={(filterType, value) =>
              console.log(`Filter ${filterType} changed to ${value}`)
            }
          />

          {/* Main Content Area */}
          <div className="flex flex-wrap gap-6">
            {/* Left Column */}
            <div className="flex-1 min-w-[750px]">
              <SmartMatchingSection
                opportunities={opportunities}
                onSignUp={signUpForOpportunity}
              />
            </div>

            {/* Right Column */}
            <div className="w-[350px] space-y-6">
              <ActivityTracker completedHours={24} totalHours={50} />
              <CalendarWidget />
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
