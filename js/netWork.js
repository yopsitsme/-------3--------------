const netWork = {
    sendRequst: function (requst) {
        if (requstBrake(requst.f_url))
            myServer.treatRequst(requst);
        return;
    },
    returnRequst: function (requst) {
        return requst;
    }
}
function requstBrake(f_url) {
    let protocal = /https:\/\/PMTC.co.il/
    console.log(protocal.test(f_url));
    if (protocal.test(f_url)) {
        return true;
    }
    myRequst.f_status = 404;
    myRequst.f_statusMasage="page not found"
    return false;

}












