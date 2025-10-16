"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { findUserByEmail, createUser, getProfileImageByEmail } from "../../../repositories/user";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false); 
//TODO: THis fucking app is fetching every fucking page need to make it fetch only once not every page
  useEffect(() => {
    const fetchUser = async () => {
      if (fetchedRef.current) return; 
      if (!auth.isLoading && auth.isAuthenticated) {
        const email = auth.user?.profile?.email;
        const name = auth.user?.profile?.name;

        if (email) {
          fetchedRef.current = true; // 👈 mark as fetched

          let user = await findUserByEmail(email);
          if (!user) user = await createUser(email, name);

          let image = "";
          const userProfileImage = await getProfileImageByEmail(email);
          if (userProfileImage?.profileImageUrl) {
            const res = await fetch(
              `/api/get-profile-image-url?key=${encodeURIComponent(
                userProfileImage.profileImageUrl
              )}`
            );
            if (res.ok) {
              const data = await res.json();
              image = data.url;
            }
          }

          setUserInfo({ name, image });
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [auth.isLoading, auth.isAuthenticated, auth.user]);

  return (
    <UserContext.Provider value={{ userInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
