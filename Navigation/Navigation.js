
import React, { useEffect,useState } from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home'
import Detail from '../Screens/Detail'


const Stack =createNativeStackNavigator();
const HomeStack=()=>{
return(
    <Stack.Navigator initialRouteName={'Index'}>
       <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="Detail" component={Detail} options={{headerShown:false}}/>



    </Stack.Navigator>
)

}





const AppNavigationContainer =()=>{
   
    

    return(
        <NavigationContainer>

         <HomeStack/> 

        </NavigationContainer>
    )
}
export default AppNavigationContainer;