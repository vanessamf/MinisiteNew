importScripts("jquery.nodom.js")
importScripts("signalr-client.js")
//importScripts("signalrConnect.js")

var recount = 0;

onmessage = function (event) {
    signalrServerCallfun_Order_child(event.data.funName, event.data.data, event.data.signalrUrl);
    //setTimeout(function () {
    //    postMessage("close");
    //}, 10000);
};
function signalrServerCallfun_Order_child(funName, data, signalrUrl) {
    send_connection(signalrUrl);
    $.connection.start().then(function () {
        //data.user_id = guid();
        data.user_id = data.user_id;
        data.message_id = guid();
        data.data_version = "0";
        data.data_key = data.message_id + data.data_version;
        //console.log("functionname : " + funName + " |info: " + JSON.stringify(data));
        $.connection.invoke(funName, data);
    });
};
//连接
function send_connection(signalrUrl) {
    let transportType = signalR.TransportType.WebSockets;
    let logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
    $.connection = new signalR.HubConnection(signalrUrl, { transport: transportType, logger: logger });
    send_signalrServerCall();
    //$.connection.onclose(function (e) {
    //    reconnect();
    //});
};
function send_signalrServerCall() {

    $.connection.on('Receipt', function (message) {
        reConnect = true;
        //console.log("Receipt: " + JSON.stringify(message));
        //alert("signalr success: " + JSON.stringify(message));
        //return message.message_id;
    });
    //本地接受回执
    $.connection.on('Result', function (message) {
        //console.log("Result: " + JSON.stringify(message));
        //alert("Result success: " + JSON.stringify(message));
        //通知服务器收到回执了
        console.log("Send Result OK !!!");
        signalrServerCallSendResult("Receipt", message);
        //call本地调用的方法，并且返回新的message,用于发送服务器回执的参数
        if (message.code == 3 && recount < 3) {
            recount++;
            //如果返回token错误，需要调用的方法
            SendOrderAgain();
        } else {
            $.connection.stop().then(function () {
                close();
            });
            //signalrLocalCall(message);
        }
    });

};

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

//通知服务器收到回执了
function signalrServerCallSendResult(message) {
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

//通用发送服务器
function signalrServerCallfun(funName, data) {
    data.message_id = guid();
    //data = JSON.stringify(data);
    $.connection.invoke(funName, data);
};
