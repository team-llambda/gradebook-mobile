import React from 'react'
import { View, StyleSheet, ViewPagerAndroid, FlatList, Text, Animated, TouchableWithoutFeedback, TextInput } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown';

import SimpleButton from '../Components/SimpleButton'

import TabView from './TabView'
import AssignmentItem from './AssignmentItem'

import CONSTANTS from '../constants'
import { isAssignmentValid } from '../helper'

import API from '@team-llambda/gradebook-api'

var projectedAssignmentCounter = 1

export default class ClassView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      popUpData: null,
      currentPage: 0,
      projectedGrade: "",
      data: {
        categories : { /*
          Tests : {
            percentage : 50
          },
          Homework : {
            percentage : 25
          },
          "In-Class Work" : {
            percentage : 25
          } */
        },
        assignments : [
        /*  {
            name : "Group Quiz 1",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 2",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 3",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 4",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 5",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 6",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 7",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 8",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 9",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 10",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          },
          {
            name : "Group Quiz 11",
            category : "Test",
            pointsEarned : 50,
            pointsTotal : 59,
            comments : "Extra credit for showing me the other calculations.",
            date : "03/19/2002"
          }, */
        ]
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentClass !== -1) {
      API.getClass(nextProps.currentClass).then((response) => {
        console.log(response)
        return response.json()
      })
      .then(responseJson => {
        var categories = responseJson.categories
        var assignments = responseJson.assignments

        //check if there are categories
        if (Object.keys(categories).length !== 0) {
          //parse data, available total points for each category
          for (var index in assignments) {
            var a = assignments[index]
            if (isAssignmentValid(a) && categories[a.category]) { //check if assignment is valid and category exists
              if (categories[a.category].pointsTotal === undefined) {
                categories[a.category].pointsTotal = 0
              }
              if (categories[a.category].pointsEarned === undefined) {
                categories[a.category].pointsEarned = 0
              }
              categories[a.category].pointsTotal += a.pointsTotal
              categories[a.category].pointsEarned += a.pointsEarned
            }
          }
        }
        
        categories = this.parseCategories(categories)

        this.setState({data: {
          categories,
          assignments
        }})
      })
      .catch(error => {
        //TODO: display err msg??
        console.error(error)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //compare categories and assignments
    if (JSON.stringify(this.state.data.categories) !== JSON.stringify(prevState.data.categories) || JSON.stringify(this.state.data.assignments) !== JSON.stringify(prevState.data.assignments)) {
      //if different, update the projected grade
      this.setState({projectedGrade: this.calculateProjectedGrade()})
    }
  }

  calculateProjectedGrade() {
    var { categories, assignments } = this.state.data
    // if there are no categories, grade is simple
    if (categories.length === 0) {
      var points = 0
      var total = 0
      for (var index in assignments) {
        var a = assignments[index]
        if (isAssignmentValid(a)) { //check that pointsEarned and pointsTotal are both numbers
          points += a.pointsEarned
          total += a.pointsTotal
        }
      }

      return ((points / total) * 100).toFixed(1)
    }
      
    // account for categories that do not have assignments in them
    // make deep copy of categories
    let effectiveCategories = JSON.parse(JSON.stringify(categories))
    
    // remove categories with no assignments
    for (let i = 0; i < effectiveCategories.length; i++) {
      if (effectiveCategories[i].pointsTotal === undefined) {
        effectiveCategories.splice(i, 1)
        i--
      }
    }
      
    // effectiveCategories now only has categories that have assignments in them;
    // scale the category weights as necessary
    let weightSum = 0
    
    for (var index in effectiveCategories) {
      weightSum += effectiveCategories[index].percentage
    }
    let scaleFactor = 100 / weightSum
      
    // calculate grade based on category weights
    var grade = 0

    for (var index in effectiveCategories) {
      var category = effectiveCategories[index]
      var categoryPercentage = category.pointsEarned / category.pointsTotal
      grade += categoryPercentage * category.percentage //weight by percentage of category on total grade
    }
    return (grade * scaleFactor).toFixed(1)
  }

  onPressTab = (index) => {
    this.setState({currentPage: index})
    this.classViewPager.setPage(index)
  }

  onPressNewAssignment = () => {
    //get list of categories
    var arr = []
    for (var index in this.state.data.categories) {
      arr.push(this.state.data.categories[index].name)
    }
    this.setState({
      popUpData: {
        title: 'new assignment',
        categories: arr
      }
    })
  }

  onPressReset = () => {
    projectedAssignmentCounter = 1
    API.getClass(this.props.currentClass).then((response) => {
      console.log(response)
      return response.json()
    })
    .then(responseJson => {
      var categories = responseJson.categories
      var assignments = responseJson.assignments

      //check if there are categories
      if (Object.keys(categories).length !== 0) {
        //parse data, available total points for each category
        for (var index in assignments) {
          var a = assignments[index]
          if (isAssignmentValid(a) && categories[a.category]) { //check if assignment is valid and category exists
            if (categories[a.category].pointsTotal === undefined) {
              categories[a.category].pointsTotal = 0
            }
            if (categories[a.category].pointsEarned === undefined) {
              categories[a.category].pointsEarned = 0
            }
            categories[a.category].pointsTotal += a.pointsTotal
            categories[a.category].pointsEarned += a.pointsEarned
          }
        }
      }
      
      categories = this.parseCategories(categories)

      this.setState({data: {
        categories,
        assignments
      }})
    })
    .catch(error => {
      //TODO: display err msg??
      console.error(error)
    })
  }

  onExitPopUp = (assignment) => {
    if (assignment) {
      var assignments = this.state.data.assignments.slice()
      assignments.unshift({...assignment, name: `projected${projectedAssignmentCounter++}`})
      this.setState({
        data: {
          assignments: assignments,
          categories: this.updateCategories(this.state.data.categories, assignments)
        }
      })
    }
    this.setState({
      popUpData: null
    })
  }

  updateCategories = (categories, assignments) => {
    console.log(categories, assignments)
    //update category object based on assignments

    //check if there are categories
    if (categories.length === 0) {
      //if no categories, no need to update categories
      return categories;
    }
    
    //convert categories array back to object
    var obj = {}
    for (var index in categories) {
      var category = categories[index]

      obj[category.name] = {percentage: category.percentage} //DO NOT inject old pointsEarned and pointsTotal values, resetting values
    }

    categories = obj;

    //check if there are categories
    if (Object.keys(categories).length !== 0) {
      //parse data, available total points for each category
      for (var index in assignments) {
        var a = assignments[index]
        if (isAssignmentValid(a) && categories[a.category]) { //check if assignment is valid and category exists
          if (categories[a.category].pointsTotal === undefined) {
            categories[a.category].pointsTotal = 0
          }
          if (categories[a.category].pointsEarned === undefined) {
            categories[a.category].pointsEarned = 0
          }
          categories[a.category].pointsTotal += a.pointsTotal
          categories[a.category].pointsEarned += a.pointsEarned
        }
      }
    }
    
    return this.parseCategories(categories)
  }

  parseCategories = (categories) => {
    var arr = []
    for (var key in categories) {
      if (key !== 'TOTAL') { //filter out TOTAL category
        arr.push({
          ...categories[key],
          name: key
        })
      }
    }
    return arr
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Projected Grade: {this.state.projectedGrade}</Text>
        <TabView data={CONSTANTS.classtabs}
          style={{justifyContent: 'space-evenly'}}
          currentPage={this.state.currentPage}
          onPressTab={this.onPressTab}
        />
        <ViewPagerAndroid
          style={styles.viewPagerContainer}
          initialPage={this.state.currentPage}
          onPageSelected={(e) => this.setState({currentPage: e.nativeEvent.position})}
          ref={(classViewPager) => {this.classViewPager = classViewPager}}
        >
          <View style={styles.pageContainer}>
            <FlatList
              data={this.state.data.assignments}
              renderItem={({item}) => <AssignmentItem item={item}/>}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <SimpleButton onPress={this.onPressNewAssignment} data="new assignment"/>
              <SimpleButton onPress={this.onPressReset} data="reset"/>
            </View>
          </View>

          <View style={styles.pageContainer}>

          </View>
        </ViewPagerAndroid>
        {this.state.popUpData !== null && 
          <PopUp data={this.state.popUpData}
            onExitPopUp={this.onExitPopUp}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewPagerContainer: {
    flex: 10
  },
  pageContainer: {
    flex: 1,
  },
})

class PopUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opacity: new Animated.Value(0),
      category: '',
      pointsTotal: '',
      pointsEarned: ''
    }
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300
    }).start()
  }

  handleOuterPress = (assignment) => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300
    }).start(() => {
      this.props.onExitPopUp(assignment)
    })
  }

  onSelectCategory = (index, value) => {
    this.setState({
      category: value
    })
  }

  onPressCancel = () => {
    this.handleOuterPress()
  }

  onPressCreateNewAssignment = () => {
    this.handleOuterPress({
      category: this.state.category,
      pointsEarned: Number(this.state.pointsEarned),
      pointsTotal: Number(this.state.pointsTotal)
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleOuterPress}>
        <Animated.View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: "#0009", width: '100%', height: '100%', opacity: this.state.opacity}}>
          <TouchableWithoutFeedback>
          <View style={{width: '80%',backgroundColor: "#FFFFFF", borderRadius: 20, alignItems: 'center', elevation: 5,padding: 5}}>
            <Text>
              {this.props.data.title}
            </Text>
            {
              this.props.data !== undefined && this.props.data.categories.length !== 0 &&
              <ModalDropdown options={this.props.data.categories} onSelect={this.onSelectCategory}/>
            }
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TextInput 
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                keyboardType='numeric'
                onChangeText={(pointsEarned) => this.setState({pointsEarned})}
                value={this.state.pointsEarned}
                maxLength={3}  //setting limit of input
              />
              <Text style={{fontSize: 30}}>/</Text>
              <TextInput 
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                keyboardType='numeric'
                onChangeText={(pointsTotal) => this.setState({pointsTotal})}
                value={this.state.pointsTotal}
                maxLength={3}  //setting limit of input
              />
            </View>
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', marginTop: 10}}>
              <SimpleButton onPress={this.onPressCancel} data="cancel"/>
              <SimpleButton onPress={this.onPressCreateNewAssignment} data="okay"/>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}