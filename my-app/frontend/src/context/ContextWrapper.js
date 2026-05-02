'use client';
import { createContext, useState } from "react";
import AppContext from "./AppContext";
export const AccountContext = createContext();

export default function ContextWrapper({ children }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [staticListData, setStaticListData] = useState([]);
  const [notificationListData, setNotificationListData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [openListView, setOpenListView] = useState(true);
  const [sort, setSort] = useState("");
  const [userData, setUserData] = useState({name:"",designation:""});

  let data = {
    isUpdating,
    isNotificationLoading,
    staticListData,
    notificationListData,
    profileData,
    userData,
    isProfileUpdating,
    openListView,
    setOpenListView,
    sort,
    setSort,
  };

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}
