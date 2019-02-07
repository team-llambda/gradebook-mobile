import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'
import CONSTANTS from '../constants'

import { storeData } from '../utils/storage'

var services; 

initiate = (userid, password, baseurl = CONSTANTS.baseUrl) => {
    if (services) return
    services = new EDUPoint.PXPWebServices(userid, password, baseurl)
}

getGradebook = (reportingPeriodIndex = null) => {
    return new Promise(function(resolve, reject) {
        services.getGradebook(reportingPeriodIndex).then(async (gradebook) => {
            await storeData('gradebook', gradebook)
            resolve(gradebook)
        }).catch((error) => {
            services = null
            reject(error)
        })
    })
}

module.exports = {
    initiate, getGradebook
}