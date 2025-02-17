import { useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "match" | "update" | "recognition";
  timestamp: string;
  read: boolean;
}

export const useNotifications = (initialNotifications?: Notification[]) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications || [],
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return {
    notifications,
    markAsRead,
    dismissNotification,
    addNotification: (notification: Omit<Notification, "id" | "read">) => {
      setNotifications((prev) => [
        {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          read: false,
        },
        ...prev,
      ]);
    },
  };
};
