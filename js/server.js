
let myRequst;
let securityCodeServer;

const myServer = {
    treatRequst: function (Requst) {
        myRequst = Requst;
        FAPI.initializeValues();
        if (Requst.f_method == "GET") {
            FAPI.fGET();
            return;
        }
        if (Requst.f_method == "POST") {
            FAPI.fPOST();
            return;
        }
        if (Requst.f_method == "PUT") {
            FAPI.fPUT();
            return;
        }
        if (Requst.f_method == "DELETE") {
            FAPI.fDELETE();
            return;
        }

    },

}

const FAPI = {
    // index: "",
    protocal: "",
    urlArr: [],
    initializeValues: function () {
        FAPI.protocal = (myRequst.f_url).slice(myRequst.f_url.search(/\?/) + 1, (myRequst.f_url).length + 1);
        FAPI.urlArr = FAPI.protocal.split('/')
    },
    fGET: function () {
        if (FAPI.urlArr[0] === "user") {
            let user = FAPI.urlArr[1]
            try {
                securityCodeServer = securityCode();
                myRequst.f_responseText = DB.getUser(user, myRequst.f_body, securityCodeServer);
                myRequst.f_responseText = JSON.stringify(myRequst.f_responseText);
                myRequst.f_status = 200;
                myRequst.f_header.security = securityCodeServer;
            }
            catch (msg) {
                myRequst.f_status = 480;
                myRequst.f_statusMasage = msg;
            }
        } else if (FAPI.urlArr[1] === "products") {
            try {
                myRequst.f_responseText = DB.getlistProduct(FAPI.urlArr[0]);
                myRequst.f_responseText = JSON.stringify(myRequst.f_responseText);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 410;
                myRequst.f_statusMasage = msg;
            }
        }
        else if (FAPI.urlArr[1] === "product") {
            try {
                myRequst.f_responseText = (DB.getProduct(FAPI.urlArr[0],FAPI.urlArr[2]));
                myRequst.f_responseText = JSON.stringify(myRequst.f_responseText);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 410;
                myRequst.f_statusMasage = msg;
            }
            console.log(myRequst.f_responseText);
        }else{
            myRequst.f_status = 450;
            myRequst.f_statusMasage = "error";
        }
    },
    fPOST: function () {
        console.log(FAPI.protocal);
        if (FAPI.urlArr[0] === "user") {
            try {
                securityCodeServer = securityCode();
                myRequst.f_header.security = securityCodeServer;
                DB.addUser(myRequst.f_body, securityCodeServer);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 420;
                myRequst.f_statusMasage = msg;
            }
        } else

            try {
                DB.addProduct(FAPI.urlArr[0], myRequst.f_body);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 420;
                myRequst.f_statusMasage = msg;
            }
    },
    fPUT: function () {

        if (FAPI.urlArr[1] === "product") {
            let productName = FAPI.urlArr[2]
            try {
                myRequst.f_responseText = DB.putProduct(FAPI.urlArr[0], productName, myRequst.f_body);
                myRequst.f_responseText = JSON.stringify(myRequst.f_responseText);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 410;
                myRequst.f_statusMasage = msg;
            }
            console.log(myRequst.f_responseText);

        }else{
            myRequst.f_status = 450;
            myRequst.f_statusMasage = "error";
        }

    },
    fDELETE: function () {

        if (FAPI.urlArr[1] === "product") {
            let productName = FAPI.urlArr[2];
            try {
                myRequst.f_responseText = (DB.deleteProduct(FAPI.urlArr[0], productName));
                myRequst.f_responseText = JSON.stringify(myRequst.f_responseText);
                myRequst.f_status = 200;
            }
            catch (msg) {
                myRequst.f_status = 410;
                myRequst.f_statusMasage = msg;
            }
        }
        else if (FAPI.urlArr[1] === "user") {
            try {
                DB.signOut(FAPI.urlArr[0])
            } catch (msg) {
                myRequst.f_status = 410;
                myRequst.f_statusMasage = msg;
            }
        }else{
            myRequst.f_status = 450;
            myRequst.f_statusMasage = "error";
        }

    },
}


function securityCode() {
    const d = new Date();
    return d.getTime();
}

