/********** ↓全局常量↓ **********/

// 超时时长（毫秒）
const __const_timeout = 10000;
const __const_unauthorized = 401;

/********** ↑全局常量↑ **********/

/********** ↓全局变量↓ **********/
// 接口访问地址
var __api_url;
/********** ↑全局变量↑ **********/

//在模板页调用此方法获取配置里的接口地址信息
function setApiUrl(api_url) {
    __api_url = api_url;
}

function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
}
//设置cookie
function setCookie(c_name, value, expireminutes) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expireminutes * 60 * 1000);
    document.cookie = c_name + "=" + escape(value) +
    ((expireminutes == null) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/";
}
//设置cookie
function setCookieValue(c_name, value) {
    document.cookie = c_name + "=" + escape(value);
}
//判断手机号合法性
function checkMobile(number) {
    if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(number))) {
        return false;
    }
    return true;
}
//替换字符串里的空格
function JTrim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
//获取AccessToken
function getToken(openid) {
    var access_token;
    $.ajax({
        url: __api_url + 'token',
        type: 'POST', //POST
        async: false,    //或false,是否异步
        data: {
            OpenId: openid,
            EnterpriseId: getUrlParam("enterpriseid")
        },
        timeout: __const_timeout,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data, textStatus, jqXHR) {
            console.log(textStatus)
            console.log(jqXHR.responseText)
            if (data.code == 0) {
                token = data.access_token;
                setCookie("access_token", token, data.expiry);
            }
            else {
                delCookie(access_token);
                //alert("获取access_token失败，错误信息：" + data.errmsg);
                alert("获取信息失败，请重新尝试");
                return null;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            delCookie(access_token);
            //alert("获取access_token失败，错误信息：" + data.errmsg);
            alert("获取信息失败，请重新尝试");
            console.log('错误')
            console.log(xhr)
            console.log(textStatus)
            return null;
        },
        complete: function () {
            console.log("结束")
            
        }
    });
    access_token = getCookie("access_token");
    return access_token;
}
//公共方法 获取AccessToken
function getAccessToken()   
{
    var token = getCookie("access_token");
    if (token == null || token == "") {
        token = refreshToken();
    }
    return token;      
}
//公共方法 获取会员信息 没有参数 
function getMemberInfo() {    
    token = getAccessToken();
    if (token == null) {
        return null;
    }
    else {
        result = getMember(token, true);//true:第一次使用cookie里的token获取会员新,如果失败可以再试一次
        return result;
    }
}


function getMember(token,repeat) {
    var result;
    $.ajax({
        url: __api_url + 'Membership',//'http://www.cuscapi.cn/CRMWebSite/Membership',
        type: 'GET', //GET
        async: false,    //或false,是否异步
        data: {
            access_token: token,
            paycode: ''
        },
        timeout: __const_timeout,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data, textStatus, jqXHR) {
            if (data.code == 0) {
                result = data;
            }
            else {
                //alert('会员信息错误：' + data.errmsg);
                alert("会员信息错误");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status == __const_unauthorized && repeat == true) {
                //alert("授权失败，再试一次");
                token = refreshToken(); // 刷新Token后再重新执行一次
                result = getMember(token,false); //第二次
            }
            else {
                //alert("获取会员信息失败：" + errorThrown);
                alert("获取会员信息失败");
            }
            //refreshToken(); // 刷新Token后再重新执行一次
        },
    });
    return result;
}

function refreshToken()
{
    var token;
    openid = getOpenId()
    if (openid == null)
    {
        return null;
    }
    token = getToken(openid);
    return token;
}
//公共方法 获取Openid 获取不到重新登录
function getOpenId()    
{
    var openid = getCookie("openId");
    if (openid == null || openid == "") {
        pageRefresh();
        return null;
    }
    return openid;
}
//公共方法 获取Openid 获取不到不重新登录
function getOpenIdwithoutRefresh() { 
    var openid = getCookie("openId");
    return openid;
}
function pageRefresh()
{
    var enterpriseid = getUrlParam("enterpriseid");
    if (enterpriseid == null || enterpriseid == "") {
        alert("页面错误，请重新登录");
    }
    else {
        alert("登录超时，即将重新登录");
        window.location.href = "../Blank?enterpriseid=" + enterpriseid+"&target=membership";
    }
}
//公共方法 将openid保存在cookie里
function saveOpenId(openid) 
{
    setCookie("openId", openid, 60 * 24 * 365);//保存一年cookie
}
function CheckMember(Phone,url,url2)
{
    if (Phone == null || Phone == "") {
        alert("请绑定手机号码");
        window.location.href = url2;
        //window.location.href = "../Blank?enterpriseid=" + enterpriseid + "&target=membership";
    }
    else {
        window.location.href = url;
    }
}
function TruncateByFour(str) {
    return str.replace(/(.{4})/g, "$1 ");
}
function TruncateMobile(str) {
    return str.replace(/\B(?=(\d{4})+(?!\d))/g,' ');
}

//Base64编码、解码相关
function Base64() {

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}