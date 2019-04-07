
var index = require("./components/index.marko");
var result = index.renderSync({});
 
result.appendTo(document.body);