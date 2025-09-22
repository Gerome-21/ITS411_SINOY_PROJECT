import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { COLOR } from '../../constants/colorPalette'

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 50,        
          paddingBottom: 8,  
          paddingTop: 8,
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0     
        },
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.inactive

      }}
    >
      <Tabs.Screen 
        name='index' 
        options={{ tabBarIcon: ({size, color}) => <Ionicons name='home' size={size} color={color}/>}}
      />
      <Tabs.Screen 
        name='albums'
        options={{ tabBarIcon: ({size, color}) => <Ionicons name='albums' size={size} color={color}/>}} 
      />
      <Tabs.Screen 
        name='createMemory'
        options={{ tabBarIcon: ({size, color}) => <Ionicons name='add-circle' size={size} color={COLOR.primary}/>}} 
      />
      <Tabs.Screen 
        name='calendar'
        options={{ tabBarIcon: ({size, color}) => <Ionicons name='calendar' size={size} color={color}/>}} 
      />
      <Tabs.Screen 
        name='profile'
        options={{ tabBarIcon: ({size, color}) => <Ionicons name='person-circle' size={size} color={color}/>}} 
      />
    </Tabs>
  )
}