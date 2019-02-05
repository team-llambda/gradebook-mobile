import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native'

import { showMessage } from "react-native-flash-message";

import ClassView from './ClassView'

import { getData } from '../utils/storage'

import tinycolor from 'tinycolor2';

import GradeBook from '../utils/gradebook'

const cardHeight = 150
const cardMarginBottom = 30
const cardPadding = 20

export default class Grades extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gradeData: {
        courses: []
      },
      gradeCardColor: ''
    }

    this.animationValue = new Animated.Value(0)
  }

  componentDidMount() {
    Promise.all([GradeBook.getGradebook(), getData('gradeCardColor')]).then((values) => {
      let gradeBook = values[0]
      let gradeCardColor = values[1]
      this.setState({gradeCardColor})
      this.setState({gradeData: gradeBook})
    })
    // .then((responseJson) => {
    //   //parse classes data
    //   let classes = responseJson.data
    //   classes = classes.map(c => {
    //     var newClass = {
    //       class: c.class_name,
    //       grade: parseGrade(c.grade),
    //       room: c.room.substring(6),
    //       code: c.code,
    //       teacher: c.teacher,
    //       period: c.period,
    //     };
    //     return newClass;
    //   })

    //   this.setState({gradeData: classes})
    // })
    .catch((error) => {
      showMessage({
        message: "Something Went Wrong :(",
        description: "Logging out...",
        type: "danger",
        floating: true
      });
      setTimeout(this.props.logout, 2000); //logout after 2 seconds
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

  refresh = () => {
    GradeBook.getGradebook().then((gradebook) => {
      this.setState({gradeData: gradebook})
    })
  }

  render() {
    const classViewStyle = {
      flex: this.animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100],
      }),
      overflow: 'hidden'
    }
    return(
      <View style={{flex: 1}}>
        <ScrollView>
          {this.state.gradeData.courses.map((item, index) => {
            return (
              <GradeCard data={item} onPress={this.props.onPressClass} index={index} key={index}
                selected={this.props.currentClass === -1 || this.props.currentClass === index}
                gradeCardColor={this.state.gradeCardColor}
              />
            )
          })}
        </ScrollView>
        <Animated.View style={classViewStyle}>
          {
            this.props.currentClass !== -1 &&
            <ClassView data={this.state.gradeData.courses[this.props.currentClass].marks[0]} currentClass={this.props.currentClass} refresh={this.refresh}/>
          }
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

    const overlayTextColor = tinycolor(this.props.gradeCardColor).isDark()
      ? '#FAFAFA'
      : '#222';

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.onPress(this.props.index)}>
        <Animated.View style={[cardStyle]}>
          <View style={[styles.cardView, {backgroundColor: this.props.gradeCardColor}]}>
            <View style={{flex: 4, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: overlayTextColor, fontFamily: 'SofiaProRegular', fontSize: 25}} numberOfLines={1}>
                {this.props.data.title}
              </Text>
              <Text style={{color: overlayTextColor, fontFamily: 'SofiaProRegular', fontSize: 25}}>
                {this.props.data.room}
              </Text>
            </View>
            <View style={{flex: 3,}}>
              <Text style={{color: overlayTextColor, fontFamily: 'SofiaProRegular', fontSize: 13}}>
                {this.props.data.staff}
              </Text>
            </View>
            <View style={{flex: 6,}}>
              <Text style={{color: overlayTextColor, fontFamily: 'SofiaProRegular', fontSize: 40}}>
                {`${this.props.data.marks[0].calculatedScoreRaw}   ${this.props.data.marks[0].calculatedScoreString}`}
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
    height: cardHeight,
    padding: cardMarginBottom/2,
  },
})