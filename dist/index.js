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

	var _github = __webpack_require__(1);

	var github = _interopRequireWildcard(_github);

	var _utils = __webpack_require__(3);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var params = utils.getParams();

	/**
	 * Sign in user, when loading the page or after authentication.
	 * 
	 * @param  {object} user Github user object.
	 */
	var signinUser = function signinUser(user) {
	    var button = window.document.getElementById('signin');

	    button.setAttribute('href', '#');
	    button.innerHTML = '<img class="avatar" src="' + (user.avatar_url + '&s=40') + '" /> ' + user.login;
	};

	/**
	 * Submit 
	 * @return {[type]} [description]
	 */
	var submit = function submit() {
	    if (!github.getToken()) return;

	    getRepos(function (response) {
	        if (repo in response) {
	            branch();
	        } else {
	            forkRepo('trailbehind/OpenHuntingData', function () {
	                // setTimeout(() => {
	                //  ping for repo
	                // }, 500)
	            });
	        }
	    });
	};

	if (params.code) {
	    github.accessToken(params.code, function () {
	        github.getUser(signinUser);
	    });
	}

	// - Branch (https://gist.github.com/potherca/3964930):

	// POST /repos/:owner/OpenHuntingData/git/refs

	// {
	//   "ref": "refs/heads/:new-branch-name>",
	//   "sha": ":recent-hash"
	// }

	// - Create File (https://developer.github.com/v3/repos/contents/#create-a-file):

	// PUT /repos/:owner/OpenHuntingData/contents/sources/US/:state/.json

	// {
	//     "message": "add source for ..",
	//     "content": "base64 encode"
	// }

	// - Pull request (https://developer.github.com/v3/pulls/#create-a-pull-request):

	// POST /repos/trailbehind/OpenHuntingData/pulls

	// {
	//     "title": "add source for ..",
	//     "head": ":owner::new-branch-name",
	//     "base": "master"
	// }

	if (github.getToken()) {
	    github.getUser(signinUser);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.branchRepo = exports.forkRepo = exports.getRepos = exports.getUser = exports.ajax = exports.accessToken = exports.getToken = undefined;

	var _nanoajax = __webpack_require__(2);

	var _nanoajax2 = _interopRequireDefault(_nanoajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var API_BASE = 'https://api.github.com';

	var token = window.localStorage.getItem('token');

	var getToken = exports.getToken = function getToken() {
	    return token;
	};

	/**
	 * Get access token from Github OAuth code.
	 * 
	 * @param  {string} code OAuth code from Github API
	 */
	var accessToken = exports.accessToken = function accessToken(code, cb) {
	    _nanoajax2.default.ajax({
	        url: 'https://quiet-waters-2356.herokuapp.com/authenticate/' + code
	    }, function (code, response) {
	        token = JSON.parse(response).token;
	        window.localStorage.setItem('token', token);

	        cb();
	    });
	};

	/**
	 * AJAX call with Github Authorization header.
	 * 
	 * @param  {object}   options nanoajax options
	 * @param  {function} cb      callback
	 */
	var ajax = exports.ajax = function ajax(options, cb) {
	    options.headers = { 'Authorization': 'token ' + token };

	    _nanoajax2.default.ajax(options, function (code, response) {
	        return cb(JSON.parse(response));
	    });
	};

	/**
	 * Get user.
	 * 
	 * @param  {function} cb function
	 */
	var getUser = exports.getUser = function getUser(cb) {
	    ajax({ url: API_BASE + '/user' }, function (response) {
	        return cb(response);
	    });
	};

	/**
	 * Get user repos.
	 * 
	 * @param  {function} cb callback
	 */
	var getRepos = exports.getRepos = function getRepos(cb) {
	    ajax({ url: API_BASE + '/user/repos' }, function (response) {
	        return cb(response);
	    });
	};

	/**
	 * Fork repo.
	 *
	 * @param  {string}   repo repo to fork, ie. 'trailbehind/OpenHuntingData'
	 * @param  {function} cb   callback
	 */
	var forkRepo = exports.forkRepo = function forkRepo(repo, cb) {
	    ajax({
	        url: API_BASE + '/repos/' + repo + '/forks',
	        method: 'POST'
	    }, function (response) {
	        return cb(response);
	    });
	};

	/**
	 * Create branch in repo.
	 * 
	 * @param  {string}   repo   repo to create the branch in.
	 * @param  {string}   branch branch name
	 * @param  {function} cb     callback
	 */
	var branchRepo = exports.branchRepo = function branchRepo(repo, branch, cb) {
	    ajax({
	        url: '/repos/:owner/OpenHuntingData/git/refs',
	        body: JSON.stringify({
	            ref: 'refs/heads/' + branch,
	            sha: ':recent-hash'
	        })
	    }, function (response) {
	        return cb(response);
	    });
	};

/***/ },
/* 2 */
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	/**
	 * Get params from URL.
	 * 
	 * Modified from http://stackoverflow.com/a/979996/1377021
	 */
	var getParams = exports.getParams = function getParams() {
	    var params = {};

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = location.search.substring(1).split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var param = _step.value;

	            var nv = param.split('=');

	            if (!nv[0]) continue;

	            params[nv[0]] = nv[1] || true;
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return params;
	};

/***/ }
/******/ ]);