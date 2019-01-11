/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import { createStackNavigator, createAppContainer } from "react-navigation";

import SplashScreen from './src/Splash/Splash'
import LoginScreen from './src/Login/Login'
import MainScreen from './src/Main/Main'

//TODO: include notifications!

const AppNavigator = createStackNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  Main: MainScreen
},
{
  initialRouteName: 'Splash',
  headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
})

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer