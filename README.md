# client-service-bridge
Bridge tools for "client-service". Running on phantomjs environment.

### Install
```
npm install client-service-bridge
```

### Demo
```
var clientTools = require('client-service-bridge');
var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
    width: 1920,
    height: 1080
};

page.open('https://github.com', function (status) {
  var base64 = page.renderBase64('PNG');
  clientTools.send(base64, function (status, res) {
    phantom.exit();
  });
});
```

### API

#### clientTools.send(data, cbk(status, res));
* data: Data which send to node.
* cbk(status, res):
	* status: response status(`success`/`fail`).
	* res: response data.