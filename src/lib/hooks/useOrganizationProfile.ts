import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./useAuth";

export interface OrganizationProfile {
  id: string;
  user_id: string;
  name: string;
  mission: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_email: string;
  phone_number: string;
  website: string;
  organization_type: string;
  tax_id: string;
  verification_status: "pending" | "verified" | "rejected";
  impact_metrics: {
    total_events: number;
    total_volunteers: number;
    total_hours: number;
  };
}

export interface Event {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  event_type: "one_time" | "recurring" | "long_term";
  start_date: string;
  end_date: string;
  location: string;
  virtual: boolean;
  skills_needed: string[];
  volunteers_needed: number;
  volunteers_registered: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  impact_metrics: Record<string, any>;
}

export interface Testimonial {
  id: string;
  organization_id: string;
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
  event_id?: string;
}

export const useOrganizationProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: profile, error: profileError } = await supabase
        .from("organization_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profile);

      // Load events
      const { data: events, error: eventsError } = await supabase
        .from("organization_events")
        .select("*")
        .eq("organization_id", profile.id)
        .order("start_date", { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(events || []);

      // Load testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from("organization_testimonials")
        .select("*")
        .eq("organization_id", profile.id)
        .order("created_at", { ascending: false });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonials || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<OrganizationProfile>) => {
    if (!user?.id || !profile?.id) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization_profiles")
        .update(updates)
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, "id" | "organization_id">) => {
    if (!profile?.id) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization_events")
        .insert({
          ...eventData,
          organization_id: profile.id
        })
        .select()
        .single();

      if (error) throw error;
      setEvents([...events, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    if (!profile?.id) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization_events")
        .update(updates)
        .eq("id", eventId)
        .eq("organization_id", profile.id)
        .select()
        .single();

      if (error) throw error;
      setEvents(events.map(e => e.id === eventId ? data : e));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonialData: Omit<Testimonial, "id" | "organization_id">) => {
    if (!profile?.id) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization_testimonials")
        .insert({
          ...testimonialData,
          organization_id: profile.id