/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _nanoajax = __webpack_require__(1);

	var _nanoajax2 = _interopRequireDefault(_nanoajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CLIENT_ID = '80f0810fe99cf4c0a7fd';
	var REDIRECT_URI = 'http://nathancahill.github.io/test/';
	var SCOPE = 'public_repo';
	var OAUTH_URL = 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&scope=' + SCOPE;

	var token = undefined,
	    params = undefined;

	/**
	 * Get params from URL
	 * 
	 * Modified from http://stackoverflow.com/a/979996/1377021
	 */
	var getParams = function getParams() {
	    var params = {};

	    for (param in location.search.substring(1).split('&')) {
	        var nv = param.split('=');

	        if (!nv[0]) continue;

	        params[nv[0]] = nv[1] || true;
	    }

	    return params;
	};

	/**
	 * Get access token from Github OAuth code.
	 * 
	 * @param  {string} code OAuth code from Github API
	 */
	var accessToken = function accessToken(code, cb) {
	    _nanoajax2.default.ajax({
	        url: 'https://quiet-waters-2356.herokuapp.com/authenticate/' + code
	    }, function (code, response) {
	        token = JSON.parse(response).token;
	        window.localStorage.setItem('token', token);

	        cb();
	    });
	};

	var ajax = function ajax(options, callback) {
	    options.headers = { 'Authorization': 'token ' + token };

	    _nanoajax2.default.ajax(options, callback);
	};

	var getRepos = function getRepos() {
	    ajax({
	        url: 'https://api.github.com/user/repos'
	    }, function (code, response) {
	        console.log(response);
	    });
	};

	params = getParams();
	token = window.localStorage.getItem('token');

	if (params.code) {
	    accessToken(params.code, getRepos);
	}

	if (token) {
	    getRepos();
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Best place to find information on XHR features is:
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

	var reqfields = [
	  'responseType', 'withCredentials', 'timeout', 'onprogress'
	]

	// Simple and small ajax function
	// Takes a parameters object and a callback function
	// Parameters:
	//  - url: string, required
	//  - headers: object of `{header_name: header_value, ...}`
	//  - body: string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
	//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
	//  - cors: If your using cross-origin, you will need this true for IE8-9
	//
	// The following parameters are passed onto the xhr object.
	// IMPORTANT NOTE: The caller is responsible for compatibility checking.
	//  - responseType: string, various compatability, see xhr docs for enum options
	//  - withCredentials: boolean, IE10+, CORS only
	//  - timeout: long, ms timeout, IE8+
	//  - onprogress: callback, IE10+
	//
	// Callback function prototype:
	//  - statusCode from request
	//  - response
	//    + if responseType set and supported by browser, this is an object of some type (see docs)
	//    + otherwise if request completed, this is the string text of the response
	//    + if request is aborted, this is "Abort"
	//    + if request times out, this is "Timeout"
	//    + if request errors before completing (probably a CORS issue), this is "Error"
	//  - request object
	//
	// Returns the request object. So you can call .abort() or other methods
	//
	// DEPRECATIONS:
	//  - Passing a string instead of the params object has been removed!
	//
	exports.ajax = function (params, callback) {
	  // Any variable used more than once is var'd here because
	  // minification will munge the variables whereas it can't munge
	  // the object access.
	  var headers = params.headers || {}
	    , body = params.body
	    , method = params.method || (body ? 'POST' : 'GET')
	    , called = false

	  var req = getRequest(params.cors)

	  function cb(statusCode, responseText) {
	    return function () {
	      if (!called)
	        callback(req.status || statusCode,
	                 req.response || req.responseText || responseText,
	                 req)
	      called = true
	    }
	  }

	  req.open(method, params.url, true)

	  var success = req.onload = cb(200)
	  req.onreadystatechange = function () {
	    if (req.readyState === 4) success()
	  }
	  req.onerror = cb(null, 'Error')
	  req.ontimeout = cb(null, 'Timeout')
	  req.onabort = cb(null, 'Abort')

	  if (body) {
	    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
	    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
	  }

	  for (var i = 0, len = reqfields.length, field; i < len; i++) {
	    field = reqfields[i]
	    if (params[field] !== undefined)
	      req[field] = params[field]
	  }

	  for (var field in headers)
	    req.setRequestHeader(field, headers[field])

	  req.send(body)

	  return req
	}

	function getRequest(cors) {
	  // XDomainRequest is only way to do CORS in IE 8 and 9
	  // But XDomainRequest isn't standards-compatible
	  // Notably, it doesn't allow cookies to be sent or set by servers
	  // IE 10+ is standards-compatible in its XMLHttpRequest
	  // but IE 10 can still have an XDomainRequest object, so we don't want to use it
	  if (cors && global.XDomainRequest && !/MSIE 1/.test(navigator.userAgent))
	    return new XDomainRequest
	  if (global.XMLHttpRequest)
	    return new XMLHttpRequest
	}

	function setDefault(obj, key, value) {
	  obj[key] = obj[key] || value
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);