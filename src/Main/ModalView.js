import React from 'react'
import { View, StyleSheet, SectionList, Text } from 'react-native'

import { ButtonCell, renderSeparator, TextCell, PointsCell, ModalDropdownCell } from '../Components/SectionListCells'

export default class ModalView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            categorySelected: this.props.assignment.category, //TODO: handle cannot find assignment category??
            pointsEarned: this.props.assignment.pointsEarned.toString(),
            pointsTotal: this.props.assignment.pointsTotal.toString()
        }
    }
    
    onSelectUpdateAssignment = () => {
        var updatedAssignmnet = JSON.parse(JSON.stringify(this.props.assignment));
        updatedAssignmnet.category = this.state.categorySelected
        updatedAssignmnet.pointsEarned = Number(this.state.pointsEarned)
        updatedAssignmnet.pointsTotal = Number(this.state.pointsTotal)
        this.props.closeModal(0, updatedAssignmnet)
    }

    onSelectDeleteAssignment = () => {
        this.props.closeModal(1)
    }

    onSelectCancel = () => {
        this.props.closeModal(2)
    }

    updatePointsEarned = (pointsEarned) => {
        this.setState({pointsEarned})
    }

    updatePointsTotal = (pointsTotal) => {
        this.setState({pointsTotal})
    }

    onSelectModalDropdown = (index, value) => {
        this.setState({
          categorySelected: value
        })
    }

    render() {
        var { assignment } = this.props;

        const buttonRenderItem = ({item, index, section: {title, data}}) => <ButtonCell text={item.text} function={item.function}/>
        const generalRenderer = ({item, index, section: {title, data}}) => {
            switch(item.type) {
                case "text":
                    return <TextCell text={item.text} details={item.details}/>
                case "modaldropdown":
                    return <ModalDropdownCell text={item.text} options={item.options} initialValue={item.initialValue}
                        onSelect={item.onSelect}
                    />
                case "points":
                    return <PointsCell text={item.text} 
                        pointsEarned={item.pointsEarned}
                        pointsTotal={item.pointsTotal}
                        updatePointsEarned={item.updatePointsEarned}
                        updatePointsTotal={item.updatePointsTotal}
                    />
            }
        }

        return (
            <View style={styles.modalContainer}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>Assignment Details</Text>
                <SectionList
                    contentContainerStyle={styles.sectionlist}
                    keyExtractor={(item, index) => item.text}
                    ItemSeparatorComponent={renderSeparator}
                    sections={[
                        {title: 'Account Options', 
                        data: [
                            {text: 'Name', details: assignment.name, type: 'text'}, 
                            {text: 'Category', options: this.props.categories, onSelect: this.onSelectModalDropdown, 
                                initialValue: this.state.categorySelected,
                                type: 'modaldropdown'
                            },
                            {text: 'Points', pointsEarned: this.state.pointsEarned, pointsTotal: this.state.pointsTotal, 
                                updatePointsEarned: this.updatePointsEarned, updatePointsTotal: this.updatePointsTotal, 
                                type: 'points'
                            }
                        ], renderItem: generalRenderer}
                    ]}
                />
                <SectionList
                    contentContainerStyle={styles.sectionlist}
                    keyExtractor={(item, index) => item.text}
                    ItemSeparatorComponent={renderSeparator}
                    sections={[
                        {title: 'Account Options', 
                        data: [
                            {text: 'Update', function: this.onSelectUpdateAssignment}, 
                            {text: 'Delete', function: this.onSelectDeleteAssignment},
                            {text: 'Cancel', function: this.onSelectCancel}
                        ], renderItem: buttonRenderItem}
                    ]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#0009',
        padding: 15,
        position: 'absolute',
        bottom: -50,
        top: 0,
        left: 0,
        right: 0
    }, 
    modalView: {
        elevation: 5,
        height: "70%",
        width: '100%',
    },
    scrollView: {
        backgroundColor: '#EFEFF4',
        width: '100%'
    },
    sectionlist: {
        borderRadius: 10, 
        width: '100%',
        backgroundColor: '#EFEFF4',
        padding: 15,
    },
})