

import React,{Component}from "react";
import { 
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Touchable,
  Image,Alert,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
  Modal,
  Button
 } from 'react-native';
 import { NavigationContainer } from "@react-navigation/native";

 import Application from './Navigation/Navigation';


const App:() => Node=()=>{


  return (
    <SafeAreaView style={{flex:1}}>

<Application/>


    </SafeAreaView>
   );
  }
   export default App;
 
 
 
