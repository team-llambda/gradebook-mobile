import React from 'react'
import { StyleSheet, View,  Image } from 'react-native'

import { StackActions, NavigationActions } from 'react-navigation'
import FlashMessage, { showMessage } from "react-native-flash-message";

import { widthPercentageToDP, heightPercentageToDP } from '../scaling'
import { getData } from '../utils/storage'
import { setCredentials, getCredentials } from '../utils/keychain'

import InputField from '../Components/InputField'
import Button from '../Components/Button'

import CONSTANTS from '../constants'

import API from '@team-llambda/gradebook-api'

const inputFieldHeight = heightPercentageToDP(6.5) //height of input fields and button

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      loading: false,
    }
  }

  componentDidMount(){
    getCredentials().then((credentials) => {
      if (credentials) {
        this.setState({email: credentials.username, password: credentials.password})
      }
    })
  }

  handleLogin = () => {
    this.setState({
      loading: true
    })
    API.login(this.state.email, this.state.password)
    .then((response) => {
      if (!response.ok) {
        //catch error
        showMessage({
          message: "Incorrect Credentials",
          type: "danger",
          floating: true
        });
        this.setState({loading: false})
      } else {
        //logging in
        this.setState({loading: false})
        this.login();
      }
    })
    .catch((error) => {
      //something went wrong, ex. network error
      this.setState({loading: false})
      showMessage({
        message: "Something Went Wrong",
        type: "warning",
        floating: true
      });
    });
  }

  login = () => {
    getData('rememberCredentials').then((val) => {
      if (val) {
        setCredentials(this.state.email, this.state.password)
      }
    })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo}/>
        <InputField style={styles.inputText} placeholder="username"
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
          height={inputFieldHeight}
        />
        <InputField style={styles.inputText} outerStyle={styles.outerInputText} placeholder="password"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          height={inputFieldHeight}
          secureTextEntry={true}
        />
        <Button style={styles.loginButton} text="login" onPress={this.handleLogin} loading={this.state.loading}/>
        <FlashMessage position="top" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CONSTANTS.backgroundColor
  },
  logo: {
    width: widthPercentageToDP(80),
    resizeMode: 'contain'
  },
  outerInputText: {
    marginTop: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(1)
  },
  inputText: {
    width: widthPercentageToDP(80),
    height: inputFieldHeight,
    borderWidth: 2,
    borderRadius: widthPercentageToDP(80)/5,
  },
  loginButton: {
    width: widthPercentageToDP(40),
    backgroundColor: '#527AFF',
    height: inputFieldHeight,
    borderRadius: widthPercentageToDP(40)/5,
    elevation: 5
  },
})