import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./useAuth";

export interface VolunteerProfile {
  id: string;
  user_id: string;
  full_name: string;
  location: string;
  contact_email: string;
  phone_number: string;
  bio: string;
  employer?: string;
  employer_program?: string;
  points: number;
  level: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_required: number;
}

export interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export const useVolunteerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  const loadProfile = async () => {
    if (!user?.id) return null;
    try {
      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("volunteer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingProfile) return existingProfile;

      // If no profile exists, create one
      const { data: newProfile, error: createError } = await supabase
        .from("volunteer_profiles")
        .insert({
          user_id: user.id,
          full_name: "",
          location: "",
          contact_email: user.email || "",
          phone_number: "",
          bio: "",
          points: 0,
          level: 1,
        })
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    } catch (err) {
      console.error("Error in loadProfile:", err);
      throw err;
    }
  };

  const loadSkills = async () => {
    const { data: skillsData, error: skillsError } = await supabase
      .from("skills")
      .select("*");

    if (skillsError) throw skillsError;
    return skillsData || [];
  };

  const loadUserSkills = async (profileId: string) => {
    const { data, error } = await supabase
      .from("volunteer_skills")
      .select("skill_id")
      .eq("volunteer_id", profileId);

    if (error) throw error;
    return data?.map((s) => s.skill_id) || [];
  };

  const loadCertifications = async (profileId: string) => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("volunteer_id", profileId);

    if (error) throw error;
    return data || [];
  };

  const loadAvailability = async (profileId: string) => {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("volunteer_id", profileId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const loadBadges = async () => {
    const { data, error } = await supabase.from("badges").select("*");

    if (error) throw error;
    return data || [];
  };

  useEffect(() => {
    if (!user?.id) return;
    if (user) {
      const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
          const profileData = await loadProfile();
          setProfile(profileData);

          const [skillsData, badgesData] = await Promise.all([
            loadSkills(),
            loadBadges(),
          ]);

          setSkills(skillsData);
          setBadges(badgesData);

          if (profileData) {
            const [userSkills, userCerts, userAvail] = await Promise.all([
              loadUserSkills(profileData.id),
              loadCertifications(profileData.id),
              loadAvailability(profileData.id),
            ]);

            setSelectedSkills(userSkills);
            setCertifications(userCerts);
            setAvailability(userAvail);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [user]);

  const updateProfile = async (updates: Partial<VolunteerProfile>) => {
    if (!user?.id) return null;
    try {
      setLoading(true);

      // Get the current profile
      const { data: currentProfile } = await supabase
        .from("volunteer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!currentProfile) {
        // Create new profile if it doesn't exist
        const { data, error } = await supabase
          .from("volunteer_profiles")
          .insert({
            user_id: user.id,
            full_name: "",
            location: "",
            contact_email: user.email || "",
            phone_number: "",
            bio: "",
            points: 0,
            level: 1,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      } else {
        // Update existing profile
        const { data, error } = await supabase
          .from("volunteer_profiles")
          .update(updates)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      }
    } catch (err: any) {
      console.error("Error in updateProfile:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSkills = async (skillIds: string[]) => {
    if (!profile) return;
    try {
      setLoading(true);
      // Delete existing skills
      await supabase
        .from("volunteer_skills")
        .delete()
        .eq("volunteer_id", profile.id);

      // Add new skills
      const { error } = await supabase.from("volunteer_skills").insert(
        skillIds.map((skillId) => ({
          volunteer_id: profile.id,
          skill_id: skillId,
        })),
      );

      if (error) throw error;
      setSelectedSkills(skillIds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCertification = async (certification: Omit<Certification, "id">) => {
    if (!profile) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("certifications")
        .insert({
          volunteer_id: profile.id,
          ...certification,
        })
        .select()
        .single();

      if (error) throw error;
      setCertifications([...certifications, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (
    availabilityList: Omit<Availability, "id">[],
  ) => {
    if (!profile) return;
    try {
      setLoading(true);

      // Add new availability slots
      const { data, error } = await supabase
        .from("availability")
        .insert(
          availabilityList.map((a) => ({
            volunteer_id: profile.id,
            day_of_week: a.day_of_week,
            start_time: a.start_time,
            end_time: a.end_time,
          })),
        )
        .select();

      if (error) throw error;

      // Load all availability slots after update
      const { data: updatedData, error: loadError } = await supabase
        .from("availability")
        .select("*")
        .eq("volunteer_id", profile.id)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (loadError) throw loadError;

      setAvailability(updatedData);
      return updatedData;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
