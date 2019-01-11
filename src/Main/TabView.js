import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native'

export default class TabView extends React.Component {
  render() {
    const tabView = this.props.data.map((value, index) => {
      return (
        <Tab key={value} 
          data={value} index={index} 
          highlighted={this.props.currentPage===index}
          onPress={this.props.onPressTab}
        />
      )
    })
    return (
      <View style={[styles.container, this.props.style]}>
        {tabView}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabText: {
    fontFamily: 'SofiaProRegular',
    fontSize: 20
  }
})

class Tab extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress(this.props.index)}
      >
        <View>
          <Text style={[styles.tabText, {color: this.props.highlighted ? 'black' : '#CCCCCC'}]}>
            {this.props.data}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}