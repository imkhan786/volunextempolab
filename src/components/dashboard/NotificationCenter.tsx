import React from "react";
import { Bell, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "match" | "update" | "recognition";
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const defaultNotifications: Notification[] = [
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
  {
    id: "3",
    title: "Achievement Unlocked!",
    message: 'You&quot;ve earned the "Community Champion" badge',
    type: "recognition",
    timestamp: "2 days ago",
    read: true,
  },
];

const NotificationCenter = ({
  notifications = defaultNotifications,
  onMarkAsRead = () => {},
  onDismiss = () => {},
}: NotificationCenterProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "match":
        return "bg-blue-100 text-blue-800";
      case "update":
        return "bg-yellow-100 text-yellow-800";
      case "recognition":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-[350px] h-[400px] bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="h-[320px] w-full pr-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${notification.read ? "bg-gray-50" : "bg-white"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onDismiss(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default NotificationCenter;
