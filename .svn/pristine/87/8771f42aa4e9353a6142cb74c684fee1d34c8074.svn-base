var reConnect = false;
var recount = 0;
var count = 0;
var userid = "";
function signalrConnect() {
    connection();
    $.connection.start()
};
//跟踪
function signalrConnectAndTrack(funName, SubscribeJson) {
    SubscribeJson.message_id = guid();
    SubscribeJson.data_version = "0";
    SubscribeJson.data_key = SubscribeJson.message_id + SubscribeJson.data_version;
    //alert(JSON.stringify(SubscribeJson));
    //alert("signalrConnectAndTrack");
    signalrConnectAndCustomize(funName, SubscribeJson);
};
//连接自定义调用服务器方法
function signalrConnectAndCustomize(funName, message) {
    connection();
    $.connection.start()
        .then(function () {
            //向服务器发送跟踪信息
            signalrServerCallfun(funName, message);
        });
};
//连接
function connection() {
    let transportType = signalR.TransportType.WebSockets;
    let logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
    $.connection = new signalR.HubConnection(signalrUrl, { transport: transportType, logger: logger });
    signalrServerCall();
    $.connection.onclose(function (e) {
        connectionsignalr("Subscribe");
    });
};
//服务器抵用的本地方法
function signalrServerCall() {

    $.connection.on('Receipt', function (message) {
        reConnect = true;
    });
    //本地接受回执
    $.connection.on('Result', function (message) {
        //alert("Result success: " + JSON.stringify(message));
        //通知服务器收到回执了
        signalrServerCallResult(message);
        //call本地调用的方法，并且返回新的message,用于发送服务器回执的参数
        if (message.code == 3 && recount < 3) {
            recount++;
            GetAccessToken();
            //如果返回token错误，需要调用的方法
            SendOrderAgain();

        } else {
            signalrLocalCall(message);
        }
    });

    //接受服务器推送的订单信息
    $.connection.on("SyncOrder", function (message) {
        //alert("receipt order success alisaTest: " + message.message_id);
        //通知服务器收到回执了
        count++;
        console.log(count);
        signalrServerCallResult(message);
        //call本地的同步订单的方法
        signalrLocalSyncOrde(message);
    });
    //接受服务器推送的推送加入点餐通知
    $.connection.on("Subscribe", function (message) {
        //通知服务器收到回执了
        signalrServerCallResult(message);
        //call本地的推送加入点餐通知的方法
        //signalrLocalJoin(message);
    });
    //接受服务器推送的推送授权通知
    $.connection.on("Authorize", function (message) {
        //通知服务器收到回执了
        signalrServerCallResult(message);
        //call本地的推送加入点餐通知的方法
        signalrLocalAuthorize(message);
    });
    //接受服务器推送的扫码支付信息    $.connection.on("ScanningPayResult", function (message) {
        //通知服务器收到回执了
        signalrServerCallResult("Receipt", message);        //call本地的扫码支付的方法        signalrLocalScanningPayResult(message);    });
    //生成支付码时，请求服务器，接受此时服务器推送的的请求结果信息    $.connection.on('ScanningPay', function (message) {        //通知服务器收到回执了
        signalrServerCallResult("Receipt", message);        //call本地的扫码支付的方法        signalrLocalScanningPay(message);
    });
};

//通用发送服务器
function signalrServerCallfun(funName, data) {
    data.message_id = guid();
    //data = JSON.stringify(data);
    $.connection.invoke(funName, data);
};

//订单发送定制
function signalrServerCallfun_Order(funName, data) {
    var work = new Worker("../Scripts/Interactive/signalrSend.js");
    var sendData = {};
    sendData["funName"] = funName;
    sendData["data"] = data;
    sendData["signalrUrl"] = signalrUrl;
    work.postMessage(sendData);
};

//通知服务器收到回执了
function signalrServerCallResult(message) {
    var messageNew = {};
    messageNew.code = 0;
    messageNew.message_id = message.message_id;
    messageNew.error_msg = message.error_msg;
    messageNew.user_id = message.user_id;
    messageNew.data_key = message.data_key;
    messageNew.data_version = message.data_version;
    messageNew.data_body = message.data_body;

    signalrServerCallfun("Receipt", messageNew);
};

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

function reconnect() {
    //var timer = setInterval(function () {    //开启定时器
    //    alert("NetWorkConnect-offLine");
    //    connectionsignalr("Refresh");
    //    if (reConnect == true) {
    //        clearInterval(timer);    //清除定时器
    //    }

    //}, 3000);
}





