import { Pressable, View } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "heroui-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GeneralEdit } from "@/components/ui/icons/GeneralEdit";
import CashoryAddTransactionModal from "@/components/containers/cashory-add-transaction-modal";
import useAuthTheme from "@/hooks/use-auth-theme";

export default function TabLayout() {
  const themeColorBackground = useThemeColor("background");
  const { isDark } = useAuthTheme();
  const [isAddTransactionVisible, setAddTransactionVisible] = useState(false);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: themeColorBackground }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: isDark ? "#FFFFFF" : "#16302B",
            tabBarInactiveTintColor: isDark ? "#A3A3A3" : "#16302B",
            tabBarLabelStyle: {
              fontWeight: "600",
            },
            tabBarStyle: {
              backgroundColor: themeColorBackground,
              borderTopColor: isDark ? "#1F2937" : "#E5E7EB",
              height: 78,
              paddingTop: 8,
              paddingBottom: 10,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="transactions"
            options={{
              title: "Transaction",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "receipt" : "receipt-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="reports"
            options={{
              title: "Reports",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "pie-chart" : "pie-chart-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>

        <View
          className="absolute right-6 bottom-32 z-10 w-15 h-15"
          pointerEvents="box-none"
        >
          <Pressable
            className="flex-1 rounded-[40px] bg-[#16302B] items-center justify-center p-3.25 border-2 border-transparent dark:border-[#3b82f615]"
            style={{
              shadowColor: "rgba(0,0,0,0.5)",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 16,
            }}
            onPress={() => setAddTransactionVisible(true)}
          >
            <GeneralEdit color="#FFFFFF" width={22} height={22} />
          </Pressable>
        </View>
      </View>
      
      <CashoryAddTransactionModal
        visible={isAddTransactionVisible}
        onClose={() => setAddTransactionVisible(false)}
        onCreate={() => {
          setAddTransactionVisible(false);
        }}
      />
    </>
  );
}
