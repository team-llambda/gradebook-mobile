import * as Keychain from 'react-native-keychain';

function setCredentials(username, password) {
    return Keychain.setGenericPassword(username, password)
}

function getCredentials() {
    return Keychain.getGenericPassword()
}

function deleteCredentials() {
    return Keychain.resetGenericPassword()
}

export {
    setCredentials, getCredentials, deleteCredentials
}