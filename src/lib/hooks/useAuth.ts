import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userType: "individual" | "organization" | "corporate",
  ) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // First create the user record
      if (!data.user?.id) throw new Error("No user ID found");

      const { error: userError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        user_type: userType,
      });

      if (userError) throw userError;

      // Create profile based on user type
      if (userType === "individual") {
        const { error: profileError } = await supabase
          .from("volunteer_profiles")
          .insert({
            user_id: data.user?.id,
            full_name: "",
            location: "",
            contact_email: email,
            phone_number: "",
            bio: "",
            points: 0,
            level: 1,
          });
        if (profileError) throw profileError;
      } else if (userType === "organization") {
        // Create organization profile with minimal data first
        const { error: profileError } = await supabase
          .from("organization_profiles")
          .insert({
            user_id: data.user?.id,
            name: "",
            mission: "",
            description: "",
            address: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
            contact_email: email,
            phone_number: "",
            website: "",
            organization_type: "",
            tax_id: "",
            cause_areas: [],
            verification_status: "pending",
            impact_metrics: {
              total_events: 0,
              total_volunteers: 0,
              total_hours: 0,
            },
          });
        if (profileError) throw profileError;
      } else if (userType === "corporate") {
        const { error: profileError } = await supabase
          .from("corporate_profiles")
          .insert({
            user_id: data.user?.id,
            company_name: "",
            location: "",
            contact_email: email,
            phone_number: "",
            description: "",
            website: "",
            industry: "",
            employee_count: 0,
            csr_focus_areas: [],
          });
        if (profileError) throw profileError;
      }
      navigate("/verify-email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
