import VolunteerProfile from "@/components/profile/VolunteerProfile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <VolunteerProfile />
    </div>
  );
}
