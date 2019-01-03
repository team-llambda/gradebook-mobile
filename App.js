/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import { createStackNavigator, createAppContainer } from "react-navigation";

import SplashScreen from './src/Splash/Splash'
import LoginScreen from './src/Login/Login'
import MainScreen from './src/Main/Main'

import API from '@team-llambda/gradebook-api'

type Props = {};
class App extends Component<Props> {
  componentDidMount() {
    //in the future, check if user is signed in, for now user signs in everytime
  }

  render() {
    return <RootStack/>
  }
}

//TODO: add setting for turning off animation!!!!
//TODO: add REMEMBER ME setting for saving credentials, remove hassle of typing username/password each time

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