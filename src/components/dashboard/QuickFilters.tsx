import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Filter, MapPin, Clock } from "lucide-react";

interface QuickFiltersProps {
  onFilterChange?: (filterType: string, value: string) => void;
  causes?: string[];
  timeCommitments?: string[];
  locations?: string[];
}

const QuickFilters = ({
  onFilterChange = () => {},
  causes = [
    "Education",
    "Environment",
    "Healthcare",
    "Animal Welfare",
    "Community Service",
  ],
  timeCommitments = ["One-time", "Weekly", "Monthly", "Flexible"],
  locations = ["Local", "Remote", "Regional", "National"],
}: QuickFiltersProps) => {
  return (
    <div className="w-full bg-white p-4 border rounded-lg shadow-sm flex items-center gap-4">
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Filter className="h-4 w-4" />
      </Button>

      <Select
        defaultValue={causes[0]}
        onValueChange={(value) => onFilterChange("cause", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select cause" />
        </SelectTrigger>
        <SelectContent>
          {causes.map((cause) => (
            <SelectItem key={cause} value={cause}>
              {cause}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={timeCommitments[0]}
        onValueChange={(value) => onFilterChange("timeCommitment", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time commitment" />
        </SelectTrigger>
        <SelectContent>
          {timeCommitments.map((time) => (
            <SelectItem key={time} value={time}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{time}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={locations[0]}
        onValueChange={(value) => onFilterChange("location", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuickFilters;
