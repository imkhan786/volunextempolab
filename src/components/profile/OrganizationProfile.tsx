import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Star,
  Users,
  FileText,
  BarChart,
} from "lucide-react";

export default function OrganizationProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    name: "",
    mission: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    contact_email: "",
    phone_number: "",
    website: "",
    organization_type: "",
    tax_id: "",
  });

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: profile, error: profileError } = await supabase
        .from("organization_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profile);
      setFormData({
        name: profile.name || "",
        mission: profile.mission || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        country: profile.country || "",
        contact_email: profile.contact_email || "",
        phone_number: profile.phone_number || "",
        website: profile.website || "",
        organization_type: profile.organization_type || "",
        tax_id: profile.tax_id || "",
      });

      // Load events
      const { data: events } = await supabase
        .from("organization_events")
        .select("*")
        .eq("organization_id", profile.id)
        .order("start_date", { ascending: true });

      setEvents(events || []);

      // Load testimonials
      const { data: testimonials } = await supabase
        .from("organization_testimonials")
        .select("*")
        .eq("organization_id", profile.id)
        .order("created_at", { ascending: false });

      setTestimonials(testimonials || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from("organization_profiles")
        .update(formData)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditMode(false);
      loadProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Toaster />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Organization Details</TabsTrigger>
          <TabsTrigger value="events">Volunteer Needs</TabsTrigger>
          <TabsTrigger value="impact">Impact & History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Organization Details
                  {profile?.verification_status === "verified" && (
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage your organization's profile and contact information
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization Type</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={formData.organization_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization_type: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select type</option>
                        <option value="nonprofit">Nonprofit</option>
                        <option value="school">School</option>
                        <option value="ngo">NGO</option>
                        <option value="event_host">Event Host</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mission</Label>
                    <Textarea
                      value={formData.mission}
                      onChange={(e) =>
                        setFormData({ ...formData, mission: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State/Province</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={formData.postal_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postal_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID (Optional)</Label>
                      <Input
                        value={formData.tax_id}
                        onChange={(e) =>
                          setFormData({ ...formData, tax_id: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Organization Info
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="font-medium">{profile?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {profile?.organization_type}
                          </div>
                        </div>
                        <div className="text-sm">{profile?.mission}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location
                      </h3>
                      <div className="mt-4 space-y-1 text-sm">
                        <div>{profile?.address}</div>
                        <div>
                          {profile?.city}, {profile?.state}{" "}
                          {profile?.postal_code}
                        </div>
                        <div>{profile?.country}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email
                      </h3>
                      <div className="mt-2 text-sm">
                        {profile?.contact_email}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Phone
                      </h3>
                      <div className="mt-2 text-sm">
                        {profile?.phone_number}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Website
                      </h3>
                      <div className="mt-2 text-sm">
                        {profile?.website && (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profile.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Volunteer Opportunities</CardTitle>
                <CardDescription>
                  Manage your organization's events and volunteer needs
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  {/* Event creation form */}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(event.start_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 mr-1" />
                              {event.volunteers_registered} /{" "}
                              {event.volunteers_needed} volunteers
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            event.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : event.status === "ongoing"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid gap-6 grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile?.impact_metrics && (
                    <>
                      <div>
                        <div className="text-sm font-medium">Total Events</div>
                        <div className="text-2xl font-bold">
                          {profile.impact_metrics.total_events || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Volunteers Engaged
                        </div>
                        <div className="text-2xl font-bold">
                          {profile.impact_metrics.total_volunteers || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Hours Served</div>
                        <div className="text-2xl font-bold">
                          {profile.impact_metrics.total_hours || 0}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {testimonial.author_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {testimonial.author_role}
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: testimonial.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-400 fill-current"
                                />
                              ),
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{testimonial.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
