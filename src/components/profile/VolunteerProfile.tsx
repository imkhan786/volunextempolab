import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVolunteerProfile } from "@/lib/hooks/useVolunteerProfile";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Medal, Calendar, FileText, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function VolunteerProfile() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    file_url: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `certifications/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("certificates")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("certificates").getPublicUrl(filePath);

      setNewCertification((prev) => ({
        ...prev,
        file_url: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCertification(newCertification);
    setNewCertification({
      name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      file_url: "",
    });
  };
  const {
    profile,
    skills,
    selectedSkills,
    certifications,
    availability,
    badges,
    loading,
    error,
    updateProfile,
    updateSkills,
    addCertification,
    updateAvailability,
  } = useVolunteerProfile();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    location: profile?.location || "",
    contact_email: profile?.contact_email || "",
    phone_number: profile?.phone_number || "",
    bio: profile?.bio || "",
    employer: profile?.employer || "",
    employer_program: profile?.employer_program || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkillToggle = (skillId: string) => {
    const newSelectedSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId];
    updateSkills(newSelectedSkills);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Toaster />
      <Tabs
        value={activeTab}
        onValueChange={(value) => setSearchParams({ tab: value })}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone</Label>
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employer">Employer (Optional)</Label>
                      <Input
                        id="employer"
                        value={formData.employer}
                        onChange={(e) =>
                          setFormData({ ...formData, employer: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employer_program">
                        CSR Program (Optional)
                      </Label>
                      <Input
                        id="employer_program"
                        value={formData.employer_program}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employer_program: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Full Name</h3>
                      <p>{profile?.full_name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p>{profile?.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{profile?.contact_email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p>{profile?.phone_number}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Bio</h3>
                    <p>{profile?.bio}</p>
                  </div>
                  {(profile?.employer || profile?.employer_program) && (
                    <div className="grid grid-cols-2 gap-4">
                      {profile?.employer && (
                        <div>
                          <h3 className="font-semibold">Employer</h3>
                          <p>{profile.employer}</p>
                        </div>
                      )}
                      {profile?.employer_program && (
                        <div>
                          <h3 className="font-semibold">CSR Program</h3>
                          <p>{profile.employer_program}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedSkills.includes(skill.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSkillToggle(skill.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {skill.category}
                        </p>
                      </div>
                      {selectedSkills.includes(skill.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {
                          [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ][dayIndex]
                        }
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSlot = {
                            day_of_week: dayIndex,
                            start_time: "09:00",
                            end_time: "17:00",
                          };
                          updateAvailability([newSlot]);
                        }}
                      >
                        Add Time Slot
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {availability
                        .filter((slot) => slot.day_of_week === dayIndex)
                        .map((slot, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 border rounded-lg"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) => {
                                    const updatedSlots = availability.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? { ...s, start_time: e.target.value }
                                          : s,
                                    );
                                    updateAvailability(updatedSlots);
                                  }}
                                />
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => {
                                    const updatedSlots = availability.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? { ...s, end_time: e.target.value }
                                          : s,
                                    );
                                    updateAvailability(updatedSlots);
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={async () => {
                                try {
                                  await supabase
                                    .from("availability")
                                    .delete()
                                    .eq("id", slot.id);

                                  setAvailability((prev) =>
                                    prev.filter((s) => s.id !== slot.id),
                                  );
                                } catch (err) {
                                  console.error(
                                    "Error deleting availability slot:",
                                    err,
                                  );
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certifications & Training</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Certification</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCertification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cert-name">Certification Name</Label>
                      <Input
                        id="cert-name"
                        value={newCertification.name}
                        onChange={(e) =>
                          setNewCertification({
                            ...newCertification,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert-issuer">Issuing Organization</Label>
                      <Input
                        id="cert-issuer"
                        value={newCertification.issuer}
                        onChange={(e) =>
                          setNewCertification({
                            ...newCertification,
                            issuer: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cert-issue-date">Issue Date</Label>
                        <Input
                          id="cert-issue-date"
                          type="date"
                          value={newCertification.issue_date}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              issue_date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cert-expiry-date">
                          Expiry Date (Optional)
                        </Label>
                        <Input
                          id="cert-expiry-date"
                          type="date"
                          value={newCertification.expiry_date}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              expiry_date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert-file">
                        Upload Certificate (Optional)
                      </Label>
                      <Input
                        id="cert-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Certification</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer}
                        </p>
                      </div>
                      {cert.file_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={cert.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>
                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      </span>
                      {cert.expiry_date && (
                        <span>
                          Expires:{" "}
                          {new Date(cert.expiry_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Medal className="h-5 w-5" />
                    Level {profile?.level}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(profile?.points || 0) % 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {profile?.points} points
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 border rounded-lg flex items-start gap-4"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Medal className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
