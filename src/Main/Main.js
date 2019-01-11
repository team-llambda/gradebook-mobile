import React from 'react'
import { View, StyleSheet, Image, Animated, TouchableWithoutFeedback, BackHandler } from 'react-native'

import TabView from './TabView'

import { ViewPager } from 'rn-viewpager'
import { StackActions, NavigationActions } from 'react-navigation'

import { hideMessage } from 'react-native-flash-message'

import Grades from './Grades'
import Settings from './Settings'

import CONSTANTS from '../constants'

import FlashMessage from "react-native-flash-message";

import API from '@team-llambda/gradebook-api'

export default class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: 0,
      currentClass: -1 //initially, class is not selected
    }

    this._animatedIsFocused = new Animated.Value(0);
  }

  onPressTab = (index) => {
    this.setState({currentPage: index})
    this.viewPager.setPage(index)
  }

  onPressClass = (index) => {
    //enter view class mode
    this.setState({
      currentClass: index
    })
    Animated.timing(this._animatedIsFocused, {
      toValue: 1,
      duration: 200,
    }).start();
  }

  onExitClass = () => {
    //leave view class mode
    this.setState({
      currentClass: -1
    })
    Animated.timing(this._animatedIsFocused, {
      toValue: 0,
      duration: 200,
    }).start();
  }

  onPressLogo = () => {
    this.onExitClass()
  }

  goBack = async () => {
    //handle back button press
    if (this.state.currentPage === 0 && this.state.currentClass !== -1) {
      //on grades pane, looking at specific class
      this.onExitClass();
    } else {
      BackHandler.exitApp()
    }

    return true;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.goBack(); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
    hideMessage()
  }

  logout = () => {
    API.logout().then(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      });
      this.props.navigation.dispatch(resetAction);
    })
  }

  render() {
    const tabStyle = {
      height: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [40, 0]
      }),
      overflow: 'hidden'
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.onPressLogo}>
          <View style={styles.logoView}>
            <Image source={require('../../assets/logo.png')} style={styles.logo}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex: 9}}>
          <Animated.View style={tabStyle}> 
            <TabView data={CONSTANTS.tabs}
              currentPage={this.state.currentPage}
              onPressTab={this.onPressTab}
            />
          </Animated.View>
          <ViewPager
            style={styles.viewPager}
            initialPage={0}
            onPageSelected={(e) => {
              this.setState({currentPage: e.position})}
            }
            ref={(viewPager) => {this.viewPager = viewPager}}
            scrollEnabled={this.state.currentClass === -1}
          >
            <View style={styles.pageContainer}>
              <Grades onPressClass={this.onPressClass} currentClass={this.state.currentClass} logout={this.logout}/>
            </View>
            <View style={styles.pageContainer}>
              <Settings logout={this.logout}/>
            </View>
          </ViewPager>
        </View>
        <FlashMessage position="top" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 40,
  },
  logoView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPager: {
    flex: 10,
  },
  logo: {
    width: '30%',
    resizeMode: 'contain'
  },
  pageContainer: {
    flex: 1
  }
})
