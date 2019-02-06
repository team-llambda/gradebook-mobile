import PushNotification from 'react-native-push-notification';
import BackgroundFetch from "react-native-background-fetch";

import { getData, storeData } from '../utils/storage'
import { getCredentials } from '../utils/keychain'

import GradeBook from '../utils/gradebook'

import CONSTANTS from '../constants'

async function notificationEvent() {
    console.log("[js] Received background-fetch event");
    console.log('---------------------------------')
    let values = await Promise.all([getData('notifications'), getCredentials(), getData('gradebook')])
    var notifications = values[0]
    var credentials = values[1]
    var oldGradebook = values[2]

    if (!notifications) return

    GradeBook.initiate(credentials.username, credentials.password)
    let gradeBook = await GradeBook.getGradebook()

    var updatedAssignments = checkForUpdatedAssignments(oldGradebook, gradeBook)

    for (var i = 0; i < updatedAssignments.length; i++) {
        var updatedA = updatedAssignments[i]
        PushNotification.localNotificationSchedule({
            message: `${updatedA.name} has just been graded`,
            date: new Date(Date.now() + (5 * 1000)),
            largeIcon: '@drawable/bluenotebook',
            smallIcon: '@drawable/eraser'
        })
    }
    
    await storeData('gradebook', gradeBook)
    // Required: Signal completion of your task to native code
    // If you fail to do this, the OS can terminate your app
    // or assign battery-blame for consuming too much background-time
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}



function checkForUpdatedAssignments(oldGradebook, newGradebook) {
    var arr = []

    for (var courseIndex = 0; courseIndex < newGradebook.courses.length; courseIndex++) {
        var classTitle = newGradebook.courses[courseIndex].title

        var oldAssignments = oldGradebook.courses[courseIndex].marks[0].assignments
        var newAssignments = newGradebook.courses[courseIndex].marks[0].assignments

        for (var i = 0; i < newAssignments.length; i++) {
            var newA = newAssignments[i]
            for (var j = 0; j < oldAssignments.length; j++) {
                var oldA = oldAssignments[j]
                if (newA.measure === oldA.measure && oldA.actualScore === null && newA.actualScore !== null) {
                    //same assignment, but grade now entered
                    arr.push({class: classTitle, name: newA.measure})
                    break;
                }

                if (j === oldAssignments.length - 1 && newA.actualScore !== null) {
                    //reached the end and assignment is graded
                    arr.push({class: classTitle, name: newA.measure})
                }
            }
        }
    }
    return arr;
}

export {
    notificationEvent
}