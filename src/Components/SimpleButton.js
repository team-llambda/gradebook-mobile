import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'

import { widthPercentageToDP, heightPercentageToDP } from '../scaling'

export default class SimpleButton extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.buttonStyle}
                onPress={this.props.onPress}
                activeOpacity={0.6}
            >
                <Text style={styles.buttonText}>
                    {this.props.data}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#527AFF',
        height: heightPercentageToDP(6),
        borderRadius: widthPercentageToDP(40)/5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'SofiaProRegular' : 'SofiaProRegular',
        padding: 20
    }
})