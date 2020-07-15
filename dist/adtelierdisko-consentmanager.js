'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/*
 * Copyright 2020 Atelier Disko. All rights reserved.
 *
 * Use of this source code is governed by the AD General Software
 * License v1 that can be found under https://atelierdisko.de/licenses
 *
 * This software is proprietary and confidential. Redistribution
 * not permitted. Unless required by applicable law or agreed to
 * in writing, software distributed on an "AS IS" BASIS, WITHOUT-
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */
var storage = {
  hasConsent: function hasConsent(type) {
    return localStorage.getItem("adcm_consent_".concat(type)) == "true";
  },
  setConsent: function setConsent(type, value) {
    localStorage.setItem("adcm_consent_".concat(type), value);
    storage.updateDataLayer();
  },
  updateDataLayer: function updateDataLayer() {
    if (!adcm.initialized) {
      return;
    }

    var data = {};

    for (var _i = 0, _Object$entries = Object.entries(localStorage); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      if (key.startsWith("adcm_consent")) {
        var id = key.split("_")[2];
        data[id] = {
          id: id,
          checked: value
        };
      }
    }

    dataLayer.push({
      consents: data
    });
  }
};

var createElement = function createElement(tag, extend) {
  var target = document.createElement(tag);

  var _extend$children = extend.children,
      children = _extend$children === void 0 ? [] : _extend$children,
      others = _objectWithoutProperties(extend, ["children"]);

  children = Array.isArray(children) ? children : [children];
  Object.entries(others).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    if (_typeof(v) === 'object') {
      Object.assign(target[k], v);
    } else {
      target[k] = v;
    }
  });
  children.forEach(function (child) {
    var _Object$entries2 = Object.entries(child),
        _Object$entries3 = _slicedToArray(_Object$entries2, 1),
        _Object$entries3$ = _slicedToArray(_Object$entries3[0], 2),
        k = _Object$entries3$[0],
        v = _Object$entries3$[1];

    target.append(createElement(k, v));
  });
  return target;
};

var provideSnippets = function provideSnippets(id) {
  var snippets = [{
    insert: 'head',
    insertFn: 'prepend',
    element: createElement('script', {
      innerHTML: "\n      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n      })(window,document,'script','dataLayer', \"".concat(id, "\");\n      ")
    })
  }, {
    insert: 'body',
    insertFn: 'append',
    element: createElement('noscript', {
      children: {
        iframe: {
          src: "https://www.googletagmanager.com/ns.html?id=".concat(id),
          height: '0',
          width: '0',
          style: {
            'display': 'none',
            'visibility': 'hidden'
          }
        }
      }
    })
  }];
  snippets.forEach(function (snippet) {
    var apply = function apply() {
      document[snippet.insert][snippet.insertFn](snippet.element);
    };

    try {
      apply();
    } catch (err) {
      document.addEventListener('DOMContentLoaded', apply);
    }
  });
};

var loadGTM = function loadGTM(id) {
  if (!adcm.initialized) {
    provideSnippets(id);
    adcm.initialized = true;
    storage.updateDataLayer();
  }
};

var adcm = {
  gtmId: null,
  consents: {},
  initialized: false,
  init: function init(gtmId) {
    adcm.gtmId = gtmId;
    loadGTM(gtmId);
  },
  setConsent: storage.setConsent,
  hasConsent: storage.hasConsent
};

module.exports = adcm;
