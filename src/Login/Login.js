import React from 'react'
import { StyleSheet, View,  Image, Text } from 'react-native'

import { widthPercentageToDP, heightPercentageToDP } from '../scaling'

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
      errormsg: ''
    }
  }

  componentDidMount(){
    //TODO: auto input credentials
    
  }

  handleLogin = () => {
    this.setState({
      loading: true
    })
    API.login(this.state.email, this.state.password)
    .then((response) => {
      if (!response.ok) {
        //catch error
        this.displayErrorMessage('incorrect credentials')
      } else {
        //logging in
        this.login();
      }
    })
    .catch((error) => {
      //something went wrong, ex. network error
      this.displayErrorMessage('something went wrong')
    });
  }

  login = () => {
    this.props.navigation.navigate('Main')
  }

  displayErrorMessage = (message) => {
    //handle problems signing in (ex. incorrect credentials/network errors)
    this.setState({errormsg: message, loading: false})
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
        {
          this.state.errormsg !== '' &&
          <Text style={styles.errorMsgText}>
            {this.state.errormsg}
          </Text>
        }
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
  errorMsgText: {
    position: 'absolute',
    bottom: 5,
    color: 'red'
  }
})