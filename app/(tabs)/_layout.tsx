import HomeIcon from "@/assets/icons/svg/HomeIcon";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const TabItem = ({ focused }: { focused: boolean }) => {
  const iconColor = focused ? "#5171b1" : "#838786";

  return (
    <View
      className={`items-center min-h-[60px] min-w-[90px] justify-center px-4 py-2 rounded-xl ${focused ? "bg-primary-50" : ""}`}
    >
      <HomeIcon color={iconColor} />
      <Text
        className={`text-xs mt-1 ${focused ? "text-primary-500" : "text-gray-600"}`}
      >
        Home
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 8,
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e5e5",
          position: "absolute",
          overflow: "hidden",
          height: 80,
          paddingLeft: 8,
          paddingTop: 8,
          paddingBottom: 8,
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
          tabBarIcon: ({ focused }) => <TabItem focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sequences"
        options={{
          headerShown: false,
          title: "Sequences",
          tabBarIcon: ({ focused }) => <TabItem focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          headerShown: false,
          title: "Analytics",
          tabBarIcon: ({ focused }) => <TabItem focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabItem focused={focused} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
