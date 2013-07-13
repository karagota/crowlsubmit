var page = require('webpage').create();
var testindex=0, loadInProgress=false;
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
page.onConsoleMessage = function(msg) {
 if (msg.indexOf("Unsafe JavaScript attempt to access frame with URL") > -1)
    return; 
    console.log(msg);
};
page.onLoadStarted = function() {
  loadInProgress = true;
  //console.log("load started");
};
page.onLoadFinished = function() {
  loadInProgress = false;
  //console.log("load finished");
};

var url = "somehost.ru";
var div_content_id="container";

var openurl = function (){
	page.open(url);
		return 0;
}
var includejs = function(){
   page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
		return 0;
}
var getforms = function(){
	return page.evaluate(function(){
			return $('form').length;
	});
}

var submit = function(i){
	page.evaluate(function(i) {
		var form = $('form:eq('+i+')');
		$(form).find(":input").each(function(index){
		
			else if ($(this).attr('name')=='e-mail') {
				$(this).val('myemail@myhhost.ru');
			} 
			
			else $(this).val('Test');
					
		});
		
		$(form).submit();
		console.log('form ' + $(form).attr('name') + ' submitted');
	},i);
}
var output = function(){
	page.evaluate(function(div_content_id) {
		//console.log('Output content of page to stdout after form has been submitted');
		console.log(document.getElementById(div_content).innerText);
	});	
}
var getlinks = function(){
	return page.evaluate(function(){
			return Array.prototype.slice.call($('a[href^="/"],[href^="http://www."'+url+'"],[href^="http://"'+url+'"]'), 0)
			.map(function (link) {
			return link.getAttribute("href");
			});
	});
	
}
var steps = [openurl,includejs,getlinks,getforms];

interval = setInterval(function() {

  if (!loadInProgress && typeof steps[testindex] == "function") {
    var formIndex = steps[testindex]((testindex-6)/4); 
    testindex++;
	
	if( typeof(formIndex) == 'object' )
	{
		console.log('The number of links on page '+url+' equals '+formIndex.length);
		
		var out='';
		for (property in formIndex) {
				console.log (property + ': ' + formIndex[property]+"; \n");
				out += property + ': ' + formIndex[property]+"; \n";
		}
		console.log (out);
		
	}
	
	else if (formIndex>0) {
	    console.log('The number of forms on page '+url+' equals '+formIndex);
		
		for (var i = 0; i < formIndex; ++i) {
		    
			steps.push(openurl);
			steps.push(includejs);
			steps.push(submit);
			steps.push(output);
		}
	}
  }
  if (typeof steps[testindex] != "function") {
    console.log("Job complete!");
	phantom.exit();
  }
}, 200);