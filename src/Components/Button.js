import React from 'react'
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native'

export default class Buttom extends React.Component {
  render() {
    return (
      <TouchableOpacity style={[this.props.style, styles.container]}
        onPress={this.props.onPress}
        activeOpacity={0.6}
        disabled={this.props.loading}
      >
        <Text style={styles.text}>
          {this.props.text}
        </Text>
        {this.props.loading &&
        <ActivityIndicator size="small" color="#FFF" style={{position: 'absolute', right: '10%'}}/>
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'SofiaProRegular' : 'SofiaProRegular'
  }
})