import { AsyncStorage } from 'react-native'
import CONSTANTS from '../constants'

async function storeData(key: string, value: object) {
    value = JSON.stringify(value)
    try {
        await AsyncStorage.setItem(key, value)
        return null; //success!
    } catch(error) {
        //error saving data
        return error;
    }
}

async function getData(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            return JSON.parse(value);
        }
    } catch (error) {
        // Error retrieving data
    }
    //if no data or error, return default value
    return CONSTANTS.defaultStorageValues[key] ? CONSTANTS.defaultStorageValues[key] : null;
}

export {
    storeData,
    getData
}