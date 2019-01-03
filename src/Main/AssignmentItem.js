import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

const circleradius = 8

export default class AssignmentItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 6}}>
                        <View style={styles.circle}/>
                        <Text style={styles.assignmentText}>
                            {this.props.item.name}
                        </Text>
                    </View>
                    <Text style={styles.gradeText}>
                        {this.calculateGrade()}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.dummycircle}/>
                        <Text style={styles.categoryText}>
                            {this.props.item.category}
                        </Text>
                    </View>
                    <Text style={styles.gradeChangeText}>
                        +0.3
                    </Text>
                </View>
            </View>
        )
    }

    calculateGrade() {
        return (this.props.item.pointsEarned/this.props.item.pointsTotal).toFixed(2)
    }
}

const styles = StyleSheet.create({
    circle: {
        width: circleradius,
        height: circleradius,
        borderRadius: circleradius/2,
        backgroundColor: '#12EB9D',
    },
    dummycircle: {
        width: circleradius,
        height: circleradius,
        borderRadius: circleradius/2,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    assignmentText: {
        fontFamily: 'sofia pro regular',
        fontSize: 18,
        marginLeft: 10
    },
    categoryText: {
        fontFamily: 'sofia pro regular',
        fontSize: 14,
        marginLeft: 10,
        color: "#CCCCCC"
    },
    gradeText: {
        fontFamily: 'sofia pro regular',
        fontSize: 20,
        flex: 1,
        textAlign: 'right'
    },
    gradeChangeText: {
        fontFamily: 'sofia pro regular',
        fontSize: 14,
        color: 'rgba(1, 203, 130, 0.46)'
    }
})