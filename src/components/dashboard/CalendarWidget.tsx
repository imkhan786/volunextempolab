import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addDays } from "date-fns";

interface CalendarWidgetProps {
  events?: Array<{
    date: Date;
    title: string;
    type: "volunteer" | "training" | "meeting";
  }>;
}

const CalendarWidget = ({
  events = [
    {
      date: new Date(),
      title: "Beach Cleanup",
      type: "volunteer",
    },
    {
      date: addDays(new Date(), 2),
      title: "Orientation",
      type: "training",
    },
    {
      date: addDays(new Date(), 5),
      title: "Team Meeting",
      type: "meeting",
    },
  ],
}: CalendarWidgetProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString(),
    );
  };

  // Function to render event badges
  const renderEventBadges = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.map((event, index) => (
      <Badge
        key={index}
        variant="secondary"
        className={`
          ${event.type === "volunteer" ? "bg-green-100 text-green-800" : ""}
          ${event.type === "training" ? "bg-blue-100 text-blue-800" : ""}
          ${event.type === "meeting" ? "bg-purple-100 text-purple-800" : ""}
          text-xs
        `}
      >
        {event.title}
      </Badge>
    ));
  };

  return (
    <Card className="w-[350px] bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: (props) => (
              <div className="flex flex-col gap-1 p-1">
                <div>{props.day}</div>
                <div className="flex flex-wrap gap-1">
                  {renderEventBadges(props.date)}
                </div>
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
