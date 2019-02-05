import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'

var services; 

initiate = (userid, password, baseurl = "https://wa-bsd405-psv.edupoint.com/") => {
    services = new EDUPoint.PXPWebServices(userid, password, baseurl)
}

getGradebook = (reportingPeriodIndex = null) => {
    return services.getGradebook(reportingPeriodIndex)
}

module.exports = {
    initiate, getGradebook
}