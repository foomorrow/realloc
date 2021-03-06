(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Realloc"] = factory();
	else
		root["Realloc"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createObservableState = __webpack_require__(2);

	var _createObservableState2 = _interopRequireDefault(_createObservableState);

	var _actionCreatorFactory = __webpack_require__(3);

	var _actionCreatorFactory2 = _interopRequireDefault(_actionCreatorFactory);

	var _JSONPathCompiler = __webpack_require__(5);

	exports['default'] = {
	  createState: _createObservableState2['default'],
	  actionCreatorFactory: _actionCreatorFactory2['default'],
	  createJSONPathMatcher: _JSONPathCompiler.createJSONPathMatcher,
	  JSONPath: _JSONPathCompiler.JSONPath
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createObservableState;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _actionCreatorFactory2 = __webpack_require__(3);

	var _actionCreatorFactory3 = _interopRequireDefault(_actionCreatorFactory2);

	var _JSONPathCompiler = __webpack_require__(5);

	function createObservableState() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var currentState = {
	    $: initialState
	  };
	  var subscribers = [];
	  function subscribe(callback) {
	    subscribers = subscribers.concat(callback);
	    return function () {
	      subscribers = subscribers.filter(function (cb) {
	        return cb !== callback;
	      });
	    };
	  }
	  function getState() {
	    return currentState.$;
	  }
	  function createGetter(path) {
	    var matcher = _JSONPathCompiler.createJSONPathMatcher(path);
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return matcher(currentState.$, args).map(function (v) {
	        return v.value;
	      });
	    };
	  }

	  var _actionCreatorFactory = _actionCreatorFactory3['default'](function () {
	    return currentState.$;
	  }, function (nextState, results) {
	    var prevState = currentState.$;
	    currentState.$ = nextState;
	    subscribers.forEach(function (cb) {
	      return cb(currentState.$, prevState, results);
	    });
	  });

	  var createAction = _actionCreatorFactory.createAction;
	  var createActions = _actionCreatorFactory.createActions;

	  return {
	    getState: getState,
	    createGetter: createGetter,
	    subscribe: subscribe,
	    createAction: createAction,
	    createActions: createActions
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = actionCreatorFactory;

	var _utils = __webpack_require__(4);

	var _JSONPathCompiler = __webpack_require__(5);

	function syncUpdate(pwd, name, $old, newValue) {
	  var $new = _utils.clone($old);
	  var cur = pwd.reduce(function (pair, key) {
	    pair[0][key] = _utils.clone(pair[1][key]);
	    return [pair[0][key], pair[1][key]];
	  }, [$new, $old]);
	  cur[0][name] = newValue;
	  return $new;
	}

	function makeCallers(actionObj) {
	  var expr = actionObj.expr;
	  var callback = actionObj.callback;
	  var options = actionObj.options;

	  var opts = _utils.assign({}, options);
	  var matcher = _JSONPathCompiler.createJSONPathMatcher(expr);
	  return function (current, payloads) {
	    return matcher(current.state, payloads).reduce(function (cur, result) {
	      var pwd = result.pwd.slice(1);
	      var name = result.name;
	      var value = callback.apply(result, payloads.concat([result.value]));
	      if (value !== void 0) {
	        return {
	          state: name !== null ? syncUpdate(pwd, name, cur.state, value) : value,
	          results: current.results.concat(result)
	        };
	      } else {
	        return cur;
	      }
	    }, current);
	  };
	}

	function actionCreatorFactory(select, collect) {
	  var createActions = function createActions() {
	    for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
	      actions[_key] = arguments[_key];
	    }

	    var callers = actions.map(makeCallers);
	    return function () {
	      for (var _len2 = arguments.length, payloads = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        payloads[_key2] = arguments[_key2];
	      }

	      var current = {
	        state: select(),
	        results: []
	      };
	      var next = callers.reduce(function (car, caller) {
	        return caller(car, payloads, select, collect);
	      }, current);
	      if (current.state !== next.state) {
	        collect(next.state, next.results);
	      }
	      return next;
	    };
	  };
	  var createAction = function createAction(expr, callback) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    return createActions({
	      expr: expr,
	      callback: callback,
	      options: options
	    });
	  };
	  return {
	    createAction: createAction,
	    createActions: createActions
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	/**
	 *
	 *
	 *
	 */

	'use strict';

	exports.__esModule = true;
	exports.stackProcess = stackProcess;
	var ArrayProto = Array.prototype,
	    ObjProto = Object.prototype,
	    FuncProto = Function.prototype;

	var nativeIsArray = Array.isArray,
	    nativeKeys = Object.keys,
	    nativeBind = FuncProto.bind,
	    nativeCreate = Object.create,
	    hasOwnProperty = ObjProto.hasOwnProperty,
	    toString = ObjProto.toString,
	    push = ArrayProto.push,
	    slice = ArrayProto.slice,
	    nativeAssign = Object.assign;

	var isUndefined = function isUndefined(obj) {
	  return obj === void 0;
	};

	exports.isUndefined = isUndefined;
	var isObject = function isObject(obj) {
	  var type = typeof obj;
	  return type === 'function' || type === 'object' && !!obj;
	};

	exports.isObject = isObject;
	var isPlainObject = function isPlainObject(obj) {
	  if (typeof obj !== 'object') {
	    return false;
	  }
	  if (obj.constructor && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
	    return false;
	  }
	  return true;
	};
	exports.isPlainObject = isPlainObject;
	var isArray = nativeIsArray || function (obj) {
	  return toString.call(obj) === '[object Array]';
	};

	exports.isArray = isArray;
	var isFunction = function isFunction(obj) {
	  return typeof obj == 'function' || false;
	};

	exports.isFunction = isFunction;
	var has = function has(obj, key) {
	  return obj != null && hasOwnProperty.call(obj, key);
	};

	exports.has = has;
	var keys = nativeKeys || function (obj) {
	  var keys = [];
	  for (var key in obj) if (has(obj, key)) keys.push(key);
	  return keys;
	};

	exports.keys = keys;
	var assign = nativeAssign || function (target) {
	  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    sources[_key - 1] = arguments[_key];
	  }

	  sources.forEach(function (source) {
	    keys(source).forEach(function (key) {
	      target[key] = source[key];
	    });
	  });
	  return target;
	};

	exports.assign = assign;
	var clone = function clone(obj) {
	  if (!obj) return obj;
	  if (isArray(obj)) {
	    return obj.slice();
	  } else {
	    return assign({}, obj);
	  }
	};

	exports.clone = clone;
	var range = function range(start, stop, step) {
	  if (stop == null) {
	    stop = start || 0;
	    start = 0;
	  }
	  step = step || 1;

	  var length = Math.max(Math.ceil((stop - start) / step), 0);
	  var range = Array(length);

	  for (var idx = 0; idx < length; idx++, start += step) {
	    range[idx] = start;
	  }
	  return range;
	};

	exports.range = range;

	function stackProcess(expr, fns) {
	  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var head = fns[0],
	      tails = fns.slice(1),
	      preProcessor = head[0],
	      postProcessor = head[1] || function (a) {
	    return a;
	  };

	  var preResult = preProcessor(expr, context);
	  if (!tails.length) {
	    return postProcessor(preResult, context);
	  } else {
	    return postProcessor(stackProcess(preResult, tails, context), context);
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.parseJSONPath = parseJSONPath;
	exports.createJSONPathMatcher = createJSONPathMatcher;
	exports.JSONPath = JSONPath;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(4);

	var _lexers = __webpack_require__(6);

	var _lexers2 = _interopRequireDefault(_lexers);

	var argsRegExpr = /\{([^\{]*)\}/g;
	var isArgIndexRegExpr = /^\[\d+\]/;

	function parseJSONPath(expr) {
	  return _utils.stackProcess(expr, _lexers2['default']);
	}

	function _parseExpr(expr, lv, isLast) {
	  if ('..' === expr) {
	    return [function (input, ctx) {
	      return input + '\n((function(){\n' + 'var stop = false;var breakFn = function(){stop = true};\n' + '\nreturn function recurfn' + lv + '(visit, parentCur, pwd, key){\n' + 'visit(parentCur, key, pwd, breakFn);\n' + '\nif(stop === false && (isPlainObject(parentCur)||isArray(parentCur))){\n' + '\nvar newPwd = key === null ? pwd : pwd.concat([key]);\n' + '\nvar parentCurKeys;\n' + '\nif(isArray(parentCur)){\n' + 'parentCurKeys = range(parentCur.length);' + '\n}else{\n' + 'parentCurKeys = [];' + '\nfor(var k in parentCur){\n' + '\nif(hasOwnProperty.call(parentCur,k)){\n' + 'parentCurKeys.push(k);\n' + '\n}\n' + '\n}\n' + '\n}\n' + '\nfor(var i = 0; i < parentCurKeys.length; i++){\n' + '\nif(stop === false ){\n' + 'recurfn' + lv + '(visit, parentCur[parentCurKeys[i]], newPwd, parentCurKeys[i]);' + '\n}\n' + '}\n' + '}\n' + '}\n' + '}())(function(recur, key, pwd, breakFn){\n' + 'var $' + lv + ' = recur;\n' + '\nif(isPlainObject($' + lv + ')){\n' + (isLast ? 'matches.push({' + 'pwd: key === null && $' + lv + ' !== $0 ? pwd.slice(0, pwd.length - 1) : pwd,' + 'name: key === null && $' + lv + ' !== $0 ? pwd[pwd.length - 1] : key,' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = key === null ? pwd : pwd.concat([key]);\n');
	    }, function (input, ctx) {
	      return input + '\n}\n' + '\n},$' + (lv - 1) + ', pwd' + (lv - 1) + ', null))\n';
	    }];
	  } else if ('*' === expr) {
	    return [function (input, ctx) {
	      return input + '\nvar $$' + (lv - 1) + ';\n' + '\nif(isArray($' + (lv - 1) + ')){\n' + '$$' + (lv - 1) + ' = range($' + (lv - 1) + '.length);' + '\n}else{\n' + '$$' + (lv - 1) + ' = [];' + '\nfor(var k' + lv + ' in $' + (lv - 1) + '){\n' + '\nif(hasOwnProperty.call($' + (lv - 1) + ',k' + lv + ')){\n' + '$$' + (lv - 1) + '.push(k' + lv + ');\n' + '\n}\n' + '\n}\n' + '\n}\n' + '\nfor(var i' + lv + ' = 0;i' + lv + ' < $$' + (lv - 1) + '.length;i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[$$' + (lv - 1) + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ',' + 'name: $$' + (lv - 1) + '[i' + lv + '],' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([$$' + (lv - 1) + '[i' + lv + ']]);\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '\n}\n';
	    }];
	  } else if (/^\d+(,\d+)*$/.test(expr)) {
	    return [function (input, ctx) {
	      return input + '\nvar k' + lv + ' = [' + expr + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ',' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([k' + lv + '[i' + lv + ']]);\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '\n}\n';
	    }];
	  } else if (/^\d+(:\d+){0,2}$/.test(expr)) {
	    return [function (input, ctx) {
	      var indexes = _utils.range.apply(null, expr.split(':').map(function (i) {
	        return parseInt(i);
	      }));
	      return input + '\nvar k' + lv + ' = [' + indexes.join(', ') + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ',' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([k' + lv + '[i' + lv + ']]);\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '\n}\n';
	    }];
	  } else if (/^\?\(.*\)$/.test(expr)) {
	    return [function (input, ctx) {
	      return input + '\nfor(var i' + lv + ' = 0; i' + lv + ' < $' + (lv - 1) + '.length; i' + lv + '++){\n' + 'if(' + expr.substring(1).replace(/@/g, '$' + (lv - 1) + '[i' + lv + ']') + '){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[i' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ',' + 'name: i' + lv + ',' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([i' + lv + ']);\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '\n}\n' + '\n}\n';
	    }];
	  } else if (/^\(.*\)$/.test(expr)) {
	    return [function (input, ctx) {
	      return input + 'var k' + lv + ' = ' + expr.replace(/@/g, '$' + (lv - 1)) + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ',' + 'name: k' + lv + ',' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([k' + lv + ']);;\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '';
	    }];
	  } else if (/^\[.+\]$/.test(expr)) {
	    return [function (input, ctx) {
	      var key = expr.substring(1, expr.length - 1);
	      return input + 'var k' + lv + ' = ' + key + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + expr + ';\n' + (isLast ? 'matches.push({' + 'pwd: pwd' + (lv - 1) + ', ' + 'name: k' + lv + ', ' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = pwd' + (lv - 1) + '.concat([k' + lv + ']);\n');
	    }, function (input, ctx) {
	      return input + (isLast ? '' : '\n}\n') + '';
	    }];
	  } else {
	    // istanbul ignore next
	    throw new Error('unexpected expression: ' + expr + '');
	  }
	}

	function createJSONPathMatcher(expr) {
	  var normalizedExprArray = parseJSONPath(expr).map(function (token) {
	    return token.replace(argsRegExpr, function ($0, $1) {
	      return 'args' + (isArgIndexRegExpr.test($1) ? '' : '[0]') + $1;
	    });
	  });
	  var lastIndex = normalizedExprArray.length - 1;
	  var body = _utils.stackProcess('', normalizedExprArray.map(function (expr, i) {
	    if (i === 0) {
	      return [function (input, ctx) {
	        return input + 'var matches = [], $0 = $, pwd0 = ["$"];\n' + (i === lastIndex ? 'matches.push({' + 'pwd: pwd0, ' + 'name: null, ' + 'value: $0' + '});\n' : '');
	      }, function (input, ctx) {
	        return input + 'return matches;';
	      }];
	    } else {
	      return _parseExpr(expr, i, i === lastIndex);
	    }
	  }));
	  try {
	    var fn = new Function('isPlainObject', 'isArray', 'hasOwnProperty', 'range', '$', 'args', body);
	    return fn.bind(null, _utils.isPlainObject, _utils.isArray, _utils.hasOwnProperty, _utils.range);
	  } catch (e) {
	    // istanbul ignore next
	    throw new Error(e + '\nfunction matcher($, args){\n' + body + '\n}');
	  }
	}

	function JSONPath(source, expr) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var resultType = (options.resultType || 'value').toUpperCase();
	  var getResult;
	  if (resultType === 'VALUE') {
	    getResult = function (v) {
	      return v.value;
	    };
	  } else if (resultType === 'PATH') {
	    getResult = function (v) {
	      return v.pwd.concat([v.name]);
	    };
	  } else {
	    throw new Error('resultType must be "VALUE" or "PATH"');
	  }
	  return createJSONPathMatcher(expr)(source).map(getResult);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = [[function (input, ctx) {
	  // braces
	  var paramExprs = ctx.paramExprs = [];
	  return input.replace(/\{([^\{]*)\}/g, function ($0, $1) {
	    return '#{' + (paramExprs.push($1) - 1) + '}';
	  });
	}, function (input, ctx) {
	  var paramExprs = ctx.paramExprs;

	  return input.map(function (p) {
	    return p.replace(/^#\{(\d+)\}$/, function ($0, $1) {
	      return '[{' + paramExprs[$1].split('.').map(function (i) {
	        return (/^\d+$/.test(i) ? '[' + i + ']' : '["' + i + '"]'
	        );
	      }).join('') + '}]';
	    })
	    //FIXME .replace(/(?=\w+)#\{(\d+)\}(?=\w+)/g,($0, $1) => '"+{' + paramExprs[$1] + '}+"')
	    .replace(/#\{(\d+)\}/g, function ($0, $1) {
	      return '{' + paramExprs[$1].split('.').map(function (i) {
	        return (/^\d+$/.test(i) ? '[' + i + ']' : '["' + i + '"]'
	        );
	      }).join('') + '}';
	    });
	  });
	}], [function (input, ctx) {
	  // predict [(...)],[?(...)]
	  var predictExprs = ctx.predictExprs = [];
	  return input.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) {
	    return ';##' + (predictExprs.push($1) - 1);
	  });
	}, function (input, ctx) {
	  var predictExprs = ctx.predictExprs;

	  return input.map(function (p) {
	    return p.replace(/^##(\d+)$/, function ($0, $1) {
	      return predictExprs[$1];
	    });
	  });
	}], [function (input, ctx) {
	  // dot identifer
	  var identifers = ctx.identifers = [];
	  return input.replace(/(?:\.)([A-Z_$]+[0-9A-Z_$]*)/ig, function ($0, $1) {
	    return ';###' + (identifers.push($1) - 1);
	  });
	}, function (input, ctx) {
	  var identifers = ctx.identifers;

	  return input.map(function (p) {
	    return p.replace(/^###(\d+)$/, function ($0, $1) {
	      return '["' + identifers[$1] + '"]';
	    });
	  });
	}], [function (input, ctx) {
	  return input.replace(/[\.\[]/g, ';');
	}], [function (input, ctx) {
	  return input.replace(/;;;|;;/g, ';..;').replace(/;$|'?\]|'$/g, '');
	}], [function (input, ctx) {
	  return input.split(';');
	}, function (input, ctx) {
	  return input.map(function (p) {
	    return p.replace(/^(\d+)$/, '[$1]');
	  });
	}]];
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map