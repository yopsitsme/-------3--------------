class FXMLHttpRequest {
    constructor() {
        this.f_status = 100;
        this.f_readyState = 1;
    }
    f_method;
    f_url;
    f_status;
    f_statusMasage;
    f_readyState;
    f_responseText;
    f_body;
    f_header = {
        contentType: "text",
        security:1,
    };
    f_onload;
    f_open(method, requst) {
        this.f_method = method;
        this.f_readyState = 2;
        this.f_url = requst;
    };

    f_send(parametraize) {
        setTimeout(() => {
            this.f_readyState = 3;
            console.log(parametraize);
            if (parametraize != undefined)
                this.f_body = JSON.parse(parametraize);
            this.f_status = 200;
            netWork.sendRequst(this);
            netWork.returnRequst();
            this.f_readyState = 4;
            this.f_onload();
        }, 0)


    };
    f_setRequestHeader(type, conttent) {
        if (type == "contentType")
            this.f_header.contentType = conttent;
    };
}








