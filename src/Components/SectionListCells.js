import React from 'react'
import { View, Switch, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native'

import ModalDropdown from 'react-native-modal-dropdown';

import tinycolor from 'tinycolor2';

class ModalDropdownCell extends React.PureComponent {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10}}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.text}
                </Text>
                {this.props.options.length === 0 ? 
                <Text style={{fontFamily: 'SofiaProRegular',}}>n/a</Text> :
                <ModalDropdown options={this.props.options} onSelect={this.props.onSelect} defaultValue={this.props.initialValue}/>
                }
            </View>
        )
    }
}

class PointsCell extends React.PureComponent {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10}}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.text}
                </Text>
                <View style={{flexDirection: 'row', fontSize: 16, letterSpacing: -0.32, color: '#8E8E93', alignItems: 'center'}}>
                    <TextInput 
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 50}}
                        keyboardType='numeric'
                        onChangeText={(pointsEarned) => this.props.updatePointsEarned(pointsEarned)}
                        value={this.props.pointsEarned}
                        maxLength={5}  //setting limit of input
                    />
                    <Text>out of</Text>
                    <TextInput 
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 50}}
                        keyboardType='numeric'
                        onChangeText={(pointsTotal) => this.props.updatePointsTotal(pointsTotal)}
                        value={this.props.pointsTotal}
                        maxLength={5}  //setting limit of input
                    />
                </View>
            </View>
        )
    }
}

class TextCell extends React.PureComponent {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10}}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.text}
                </Text>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.details}
                </Text>
            </View>
        )
    }
}

class ButtonCell extends React.PureComponent {
    render() {
      return (
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10}} onPress={this.props.function}>
          <Text style={{fontFamily: 'SofiaProRegular',}}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      )
    }
  }

class SwitchCell extends React.PureComponent {
    render() {
        return(
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10}}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.title}
                </Text>
                <Switch 
                    value={this.props.value}
                    onValueChange={() => this.props.toggleSwitch(this.props.keyVal)}
                />
            </View>
        )
    }
}

class ColorPickerCell extends React.PureComponent {
    render() {
        const overlayTextColor = tinycolor(this.props.color).isDark()
        ? '#FAFAFA'
        : '#222';

        return(
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10}}>
                <Text style={{fontFamily: 'SofiaProRegular',}}>
                    {this.props.title}
                </Text>
                <TouchableOpacity
                onPress={this.props.openColorModal}
                style={[
                    styles.colorPreview,
                    { backgroundColor: this.props.color}
                ]}
                >
                    <Text style={[styles.colorString, { color: overlayTextColor }]}>
                        {this.props.color}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const renderSeparator = () => {
    return <View
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%'
      }}
    />;
};

const styles = StyleSheet.create({
    colorString: {
        fontFamily: 'SofiaProRegular',
        fontSize: 20
    },
    colorPreview: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export {
    ButtonCell,
    SwitchCell,
    ColorPickerCell,
    TextCell,
    renderSeparator,
    PointsCell,
    ModalDropdownCell
}

