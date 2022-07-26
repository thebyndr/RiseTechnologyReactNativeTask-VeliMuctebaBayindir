
import React, { useEffect,useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../Screens/Home'



const Stack =createNativeStackNavigator();
const HomeStack=()=>{
return(
    <Stack.Navigator initialRouteName={'Index'}>
       <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
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