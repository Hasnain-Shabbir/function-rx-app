import {
  AnalyticsIcon,
  HomeIcon,
  ICON_COLORS,
  MotionIcon,
  UserIcon,
} from "@/assets/icons";
import { useSession } from "@/context";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabItem = ({
  focused,
  icon: Icon,
  label,
}: {
  focused: boolean;
  icon: React.ComponentType<any>;
  label: string;
}) => {
  const iconColor = focused ? ICON_COLORS.primary : ICON_COLORS.gray;

  return (
    <View
      className={`items-center min-h-[60px] min-w-[90px] justify-center px-4 py-2 rounded-xl ${focused ? "bg-primary-50" : ""}`}
    >
      <Icon color={iconColor} />
      <Text
        className={`text-xs mt-1 ${focused ? "text-primary-500" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </View>
  );
};

const Layout = () => {
  const insets = useSafeAreaInsets();
  const { isLoading, session } = useSession();

  // While restoring session, render a lightweight loader to avoid route flicker
  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  // If not authenticated, redirect to login
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 8,
        },
        tabBarStyle: {
          backgroundColor: "#f9faf7",
          borderTopColor: "#e5e5e5",
          position: "absolute",
          overflow: "hidden",
          height: 80 + insets.bottom,
          paddingLeft: 8,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingRight: 8,
          borderWidth: 1,
          shadowRadius: 0,
          shadowColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={HomeIcon} label="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          headerShown: false,
          title: "Analytics",
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={AnalyticsIcon} label="Analytics" />
          ),
        }}
      />
      <Tabs.Screen
        name="sequences"
        options={{
          headerShown: false,
          title: "Sequences",
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={MotionIcon} label="Sequences" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={UserIcon} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
