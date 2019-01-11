import React from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'

import { StackActions, NavigationActions } from 'react-navigation'

import API from '@team-llambda/gradebook-api'

export default class Splash extends React.Component {
    componentDidMount() {
        API.isAuthenticated().then((response) => {
            if (response.ok) {
                this.navigate('Main')
            } else {
                this.navigate('Login')
            }
        })
    }

    navigate(route) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: route })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View>
                <Image source={require('../../assets/bluenotebook.png')} style={styles.bluenotebook}/>
                <Image source={require('../../assets/eraser.png')} style={styles.eraser}/>
                <Image source={require('../../assets/greennotebook.png')} style={styles.greennotebook}/>
                <Image source={require('../../assets/pencil.png')} style={styles.pencil}/>
                <Image source={require('../../assets/pinknotebook.png')} style={styles.pinknotebook}/>
            </View>
        )
    }
}

const getRandomX = function () {
    return Math.floor((Math.random() * (Dimensions.get('window').width + 1)));
}

const getRandomY = function () {
    return Math.floor((Math.random() * (Dimensions.get('window').height + 1)));
}

const getRandomWidth = function () {
    return Math.floor(Math.random() * 75 + 50);
}

const getRandomRotate = function () {
    return Math.floor(Math.random() * 360);
}

const styles = StyleSheet.create({
    bluenotebook: {
        position: 'absolute',
        left: getRandomX(),
        top: getRandomY(),
        width: getRandomWidth(),
        resizeMode: 'contain',
        transform:[{rotate: `${getRandomRotate()} deg`}]
    },
    eraser: {
        position: 'absolute',
        left: getRandomX(),
        top: getRandomY(),
        width: getRandomWidth(),
        resizeMode: 'contain',
        transform:[{rotate: `${getRandomRotate()} deg`}]
    },
    greennotebook: {
        position: 'absolute',
        left: getRandomX(),
        top: getRandomY(),
        width: getRandomWidth(),
        resizeMode: 'contain',
        transform:[{rotate: `${getRandomRotate()} deg`}]
    },
    pencil: {
        position: 'absolute',
        left: getRandomX(),
        top: getRandomY(),
        width: getRandomWidth(),
        resizeMode: 'contain',
        transform:[{rotate: `${getRandomRotate()} deg`}]
    },
    pinknotebook: {
        position: 'absolute',
        left: getRandomX(),
        top: getRandomY(),
        width: getRandomWidth(),
        resizeMode: 'contain',
        transform:[{rotate: `${getRandomRotate()} deg`}]
    },
})