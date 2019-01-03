import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native'

import ClassView from './ClassView'

import { gradeToLetterConverter } from '../helper'

import API from '@team-llambda/gradebook-api'

const cardHeight = 150
const cardMarginBottom = 30
const cardPadding = 20

export default class Grades extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gradeData: [
        // {
        //   "teacher": "George Washington",
        //   "class": "AP Calc AB",
        //   "grade": 74.2,
        //   "period": "2",
        //   "room": "31414"
        // },
        // {
        //   "teacher": "Benjamin Franklin",
        //   "class": "AP Language Arts",
        //   "grade": 81.4,
        //   "period": "3",
        //   "room": "31414"
        // },
        // {
        //   "teacher": "Benjamin Franklin",
        //   "class": "AP Language Arts",
        //   "grade": 81.4,
        //   "period": "3",
        //   "room": "31414"
        // },
        // {
        //   "teacher": "Benjamin Franklin",
        //   "class": "AP Language Arts",
        //   "grade": 81.4,
        //   "period": "3",
        //   "room": "31414"
        // }
      ]
    }

    this.animationValue = new Animated.Value(0)
  }

  componentDidMount() {
    API.getClasses().then((response) => response.json())
    .then((responseJson) => {
      //parse classes data
      let classes = responseJson.data
      classes = classes.map(c => {
        var newClass = {
          class: c.class_name,
          grade: Number(c.grade.substring(0, c.grade.length-1)).toFixed(1),
          room: c.room.substring(6),
          code: c.code,
          teacher: c.teacher,
          period: c.period,
        };
        return newClass;
      })

      this.setState({gradeData: classes})
    })
    .catch((error) => {
      //TODO: error msg?
      console.error(error)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentClass === -1 && nextProps.currentClass !== -1) {
      //class list -> viewing specific class
      this.shrinkScrollView()
    } else if (this.props.currentClass !== -1 && nextProps.currentClass === -1) {
       //class list <- viewing specific class
      this.expandScrollView()
    }
  }

  shrinkScrollView = () => {
    Animated.timing(this.animationValue, {
      toValue  : 1,
      duration : 200
    }).start()
  }

  expandScrollView = () => {
    Animated.timing(this.animationValue, {
      toValue  : 0,
      duration : 200
    }).start()
  }

  render() {
    const classViewStyle = {
      flex: this.animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100],
      }),
    }
    return(
      <View style={{flex: 1}}>
        <ScrollView>
          {this.state.gradeData.map((item, index) => {
            return (
              <GradeCard data={item} onPress={this.props.onPressClass} index={item.period} key={index}
                selected={this.props.currentClass === -1 || this.props.currentClass === item.period}
              />
            )
          })}
        </ScrollView>
        <Animated.View style={classViewStyle}>
          <ClassView currentClass={this.props.currentClass}/>
        </Animated.View>
      </View>
    )
  }
}

class GradeCard extends React.Component {
  constructor(props) {
    super(props)

    this.animationValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.fadeIn()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected !== nextProps.selected) {
      if (nextProps.selected) {
        this.fadeIn()
      } else {
        this.fadeOut()
      }
    }
  }

  fadeIn = () => {
    Animated.timing(this.animationValue, {
      toValue  : 1,
      duration : 200
    }).start()
  }

  fadeOut = () => {
    Animated.timing(this.animationValue, {
        toValue  : 0,
        duration : 200
    }).start()
  }

  render() {
    const cardStyle = {
      opacity: this.animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      height: this.animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, cardHeight + cardMarginBottom],
      }),
      overflow: 'hidden',
      // marginTop: this.animationValue.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [0, 10],
      // }),
      // marginBottom: this.animationValue.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [0, 10],
      // }), 
      // padding: this.animationValue.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [0, 20],
      // }), 
    }
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.onPress(this.props.index)}>
        <Animated.View style={[cardStyle]}>
          <View style={styles.cardView}>
            <View style={{flex: 4, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#FFF', fontFamily: 'sofia pro regular', fontSize: 25}} numberOfLines={1}>
                {this.props.data.class}
              </Text>
              <Text style={{color: '#FFF', fontFamily: 'sofia pro regular', fontSize: 25}}>
                {this.props.data.room}
              </Text>
            </View>
            <View style={{flex: 3,}}>
              <Text style={{color: '#FFF', fontFamily: 'sofia pro regular', fontSize: 13}}>
                {this.props.data.teacher}
              </Text>
            </View>
            <View style={{flex: 6,}}>
              <Text style={{color: '#FFF', fontFamily: 'sofia pro regular', fontSize: 40}}>
                {`${this.props.data.grade}   ${gradeToLetterConverter(this.props.data.grade)}`}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FF9472',
    height: cardHeight,
    padding: cardMarginBottom/2,
  },
})