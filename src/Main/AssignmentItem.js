import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

const circleradius = 8

export default class AssignmentItem extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    _onPress = () => {
        this.props.openAssignmentModal(this.props.index);
    }

    render() {
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 6}}>
                        <View style={styles.circle}/>
                        <Text style={styles.assignmentText}>
                            {this.props.item.measure}
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
                            {this.props.item.type}
                        </Text>
                    </View>
                    <Text style={[styles.gradeChangeText, {color: this.props.gradeChange >= 0 ? 'rgba(1, 203, 130, 0.46)' : 'rgba(203, 1, 1, 0.46)'}]}>
                        {this.props.gradeChange && ((this.props.gradeChange >= 0 ? '+' : '') + this.props.gradeChange)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    calculateGrade() {
        return (this.props.item.actualScore/this.props.item.assignedScore).toFixed(2)
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
        fontFamily: 'SofiaProRegular',
        fontSize: 18,
        marginLeft: 10
    },
    categoryText: {
        fontFamily: 'SofiaProRegular',
        fontSize: 14,
        marginLeft: 10,
        color: "#CCCCCC"
    },
    gradeText: {
        fontFamily: 'SofiaProRegular',
        fontSize: 20,
        flex: 1,
        textAlign: 'right'
    },
    gradeChangeText: {
        fontFamily: 'SofiaProRegular',
        fontSize: 14,
    }
})