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

const Home = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: HomeProps) => {
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
                onSignUp={(id) =>
                  console.log(`Signed up for opportunity ${id}`)
                }
              />
            </div>

            {/* Right Column */}
            <div className="w-[350px] space-y-6">
              <ActivityTracker completedHours={24} totalHours={50} />
              <CalendarWidget />
              <NotificationCenter
                onMarkAsRead={(id) =>
                  console.log(`Marked notification ${id} as read`)
                }
                onDismiss={(id) => console.log(`Dismissed notification ${id}`)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
