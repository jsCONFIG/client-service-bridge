var webPage = require('webpage');
var system = require('system');

var params = system.args;
var clientConfig = {
    secret: params[4],
    api: params[3]
};

var initEnv = function (page) {
    if (clientConfig.secret) {
        page.customHeaders = {
            'X-Secret': clientConfig.secret
        };
    }
};

var bridgeId = system.args[2];

var rfc3986 = function (str) {
  return str.replace(/[!'()*]/g, function (unit) {
    return '%' + unit.charCodeAt(0).toString(16).toUpperCase()
  })
};

var paramsToQuery = function (params) {
    var queryStrs = [];
    for (var i in params) {
        if (params.hasOwnProperty(i)) {
            queryStrs.push(i + '=' + params[i]);
        }
    }
    return rfc3986(queryStrs.join('&'));
};

var concatUrlWidthObj = function (url, obj) {
    if (!obj || !Object.keys(obj).length) {
        return url;
    }
    var urlQueryFlagPos = url.indexOf('?');
    if (urlQueryFlagPos === -1) {
        url += '?';
    }
    else if ((url.length - 1) !== urlQueryFlagPos) {
        url += '&';
    }
    url += paramsToQuery(obj);
    return url;
};

var send = function (data, cbk) {
    var postPage = webPage.create();
    initEnv(postPage);
    if (typeof data !== 'object') {
        data = {data: data};
    }
    var settings = {
        operation: 'POST',
        encoding: 'utf8',
        headers: {
            'Content-Type': 'application/json',
            'X-BridgeId': bridgeId
        },
        data: JSON.stringify(data)
    };
    postPage.open(
        clientConfig.api,
        settings,
        function (status) {
            cbk && cbk(status, postPage.plainText);
            setTimeout(function () {
                postPage.close();
            }, 500);
        }
    );
};

var get = function (data, cbk) {
    var getterPage = webPage.create();
    initEnv(getterPage);
    var requestUrl = concatUrlWidthObj(clientConfig.api, data);
    var settings = {
        encoding: 'utf8',
        headers: {
            'Content-Type': 'application/json',
            'X-BridgeId': bridgeId
        }
    };
    getterPage.open(
        requestUrl,
        settings,
        function (status) {
            cbk && cbk(status, getterPage.plainText);
            setTimeout(function () {
                getterPage.close();
            }, 500);
        }
    );
};

module.exports = {
    send: send,
    get: get
};
