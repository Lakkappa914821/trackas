import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const loadUserDetails = async () => {
      // 1. Get current authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        console.error("Authentication error:", authError?.message);
        setUserDetails(null);
        return;
      }

      const user = authData.user;
      console.log("Logged-in User ID:", user.id);

      // 2. Fetch lecturer details using ID (MOST IMPORTANT)
      const { data: lecturer, error: lecError } = await supabase
        .from("lecturers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (lecError) {
        console.error("Error fetching lecturer:", lecError.message);
        setUserDetails(null);
        return;
      }

      console.log("Lecturer row successfully fetched");


      console.log("Lecturer Details Loaded:", lecturer);
      setUserDetails(lecturer);
    };

    loadUserDetails();
  }, []);

  return { userDetails };
};

export default useUserDetails;
