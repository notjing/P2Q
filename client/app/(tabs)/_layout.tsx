import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
        <Tabs.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          href:null,
          tabBarStyle: {
            display: 'none', 
          },
        }}
        />
        <Tabs.Screen 
        name="play" 
        options={{ 
            headerShown: false,
            href:null,
            tabBarStyle: {
              display: 'none', 
            },
        }}
        />  
        <Tabs.Screen 
        name="not-found" 
        options={{ headerTitle: "Page Not Found" }}
        />
    </Tabs>
  );
}
