import React from 'react'
import PushNotification from 'react-native-push-notification'

export default class PushNotifController extends React.Component {
    componentDidMount() {
        PushNotification.configure({
            onNotification: function(notification) {
      
            }
        })
    }
    render() {
        return null;
    }
}