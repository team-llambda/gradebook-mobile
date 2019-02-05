import React from 'react'
import { View, StyleSheet, FlatList, Text, Modal } from 'react-native'

import SimpleButton from '../Components/SimpleButton'

import AssignmentItem from './AssignmentItem'
import ModalView from './ModalView'

import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'
import cloneDeep from 'lodash.clonedeep';

var projectedAssignmentCounter = 1

export default class ClassView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: null, //-1 = new assignment, else = assignmentIndex
      refreshing: false,
      data: cloneDeep(this.props.data),
      gradeChanges: [],
    }
  }

  calculateGradeChanges = (data) => {
    var mark = cloneDeep(data ? data : this.state.data)
    var gradeChanges = []

    var newGrade = mark.calculateScore;
    for (var i =  0; i < mark.assignments.length - 1;) {
      mark.assignments.splice(i, 1)

      var prevGrade = mark.calculateScore;
      var gradeChange = newGrade - prevGrade
      gradeChanges.push(gradeChange)

      newGrade = prevGrade
    }

    return gradeChanges
  }

  componentDidMount() {
    this.setState({gradeChanges: this.calculateGradeChanges()})
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({refreshing: false})
      this.setDataState(this.props.data)
    }
  }

  getCategories = () => {
    //returns list of categories 
    var arr = []
    for (var index in this.state.data.gradeCalculation) {
      arr.push(this.state.data.gradeCalculation[index].type)
    }

    return arr
  }

  onPressNewAssignment = () => {
    //get list of categories
    this.setState({modalVisible: -1})
  }

  onPressReset = () => {
    projectedAssignmentCounter = 1
    this.setDataState(cloneDeep(this.props.data))
  }

  setDataState = (data) => {
    this.setState({data: data, gradeChanges: this.calculateGradeChanges(data)})
  }

  openAssignmentModal = (assignmentIndex) => {
    this.setState({modalVisible: assignmentIndex})
  }

  refresh = () => {
    this.setState({refreshing: true})
    this.props.refresh()
  }

  closeAssignmentModal = (exitcode, assignment) => {
    //exitcode: number, 0 = update, 1 = delete, 2 = cancel
    if (exitcode !== 2) {
      var newData = cloneDeep(this.state.data)

      switch(exitcode) {
        case 0:
          if (this.state.modalVisible === -1) {
            newData.assignments.unshift(new EDUPoint.Assignment(true, assignment.category, assignment.pointsTotal, assignment.pointsEarned, ""))
            newData.assignments[0].measure = assignment.measure;
          } else {
            newData.assignments[this.state.modalVisible].type = assignment.category
            newData.assignments[this.state.modalVisible].assignedScore = assignment.pointsTotal
            newData.assignments[this.state.modalVisible].actualScore = assignment.pointsEarned
          }
          break;
        case 1:
          newData.assignments.splice(this.state.modalVisible, 1)
          break;
      }
      this.setDataState(newData)
    }
    this.setState({
      modalVisible: null
    })
  }

  render() {
    modalView = null;

    if (this.state.modalVisible == -1) {
      modalView = <ModalView assignment={{measure: `projected${projectedAssignmentCounter}`}} categories={this.getCategories()} closeModal={this.closeAssignmentModal} />
    } else {
      modalView = <ModalView assignment={this.state.data.assignments[this.state.modalVisible]} categories={this.getCategories()} closeModal={this.closeAssignmentModal}/>
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible !== null}
          onRequestClose={() => {
          
          }}
        >
          {modalView}
        </Modal>
        <Text>Projected Grade: {(this.state.data.calculateScore * 100).toFixed(2)}</Text>

        <View style={styles.pageContainer}>
          <FlatList
            data={this.state.data.assignments}
            renderItem={({item, index}) => <AssignmentItem item={item} index={index} gradeChange={(this.state.gradeChanges[index] * 100).toFixed(2)} openAssignmentModal={this.openAssignmentModal}/>}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.state.refreshing}
            onRefresh={() => this.refresh(this.props.currentClass)}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <SimpleButton onPress={this.onPressNewAssignment} data="new assignment"/>
            <SimpleButton onPress={this.onPressReset} data="reset"/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageContainer: {
    flex: 10,
  },
})