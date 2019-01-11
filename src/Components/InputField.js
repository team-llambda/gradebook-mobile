import React from 'react'
import { StyleSheet, View, TextInput, Platform, Animated, TouchableWithoutFeedback } from 'react-native'

import CONSTANTS from '../constants'

export default class InputField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }
    this._animatedIsFocused = new Animated.Value(0);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.focused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  onFocus = () => {
    this.setState({
      focused: true
    })
  }

  onBlur = () => {
    this.setState({
      focused: false
    })
  }

  render() {
    const paddingTop = 5 //make space for floating text input
    const borderColor = this.state.focused ? '#527AFF' : '#BDBDBD'

    var topOffset = Platform.OS === 'ios' ? 0 : -5
    const labelStyle = {
      position: 'absolute',
      left: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [35, 30],
      }),
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.height/2 - paddingTop + topOffset, topOffset],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#828282', '#527AFF'],
      }),
      backgroundColor: CONSTANTS.backgroundColor,
      zIndex: 1,
      fontFamily: 'SofiaProRegular'
    };
    return (
      <View style={[{paddingTop: paddingTop}, this.props.outerStyle]}>
        <TouchableWithoutFeedback onPress={() => this.textInput.focus()}>
          <Animated.Text style={labelStyle}>
            {this.props.placeholder} 
          </Animated.Text>
        </TouchableWithoutFeedback>
        <View style={[styles.container, this.props.style, {borderColor}]}>
          <TextInput style={styles.textInput}
            underlineColorAndroid={'transparent'}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()} 
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            secureTextEntry={this.props.secureTextEntry}
            autoCapitalize = 'none'
            blurOnSubmit
            ref={(ref) => this.textInput = ref}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: 'SofiaProRegular',
  }
})