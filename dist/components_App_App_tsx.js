"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkhmcclinic_skeleton_app"] = self["webpackChunkhmcclinic_skeleton_app"] || []).push([["components_App_App_tsx"],{

/***/ "./components/App/App.tsx":
/*!********************************!*\
  !*** ./components/App/App.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ \"./constants.ts\");\n\n\n\nconst PageOne = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().lazy(()=>__webpack_require__.e(/*! import() */ \"pages_PageOne_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! ../../pages/PageOne */ \"./pages/PageOne.tsx\")));\nconst PageTwo = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().lazy(()=>__webpack_require__.e(/*! import() */ \"pages_PageTwo_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! ../../pages/PageTwo */ \"./pages/PageTwo.tsx\")));\nconst PageThree = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().lazy(()=>Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_react-router-dom_dist_index_js\"), __webpack_require__.e(\"pages_PageThree_tsx\")]).then(__webpack_require__.bind(__webpack_require__, /*! ../../pages/PageThree */ \"./pages/PageThree.tsx\")));\nconst PageFour = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().lazy(()=>__webpack_require__.e(/*! import() */ \"pages_PageFour_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! ../../pages/PageFour */ \"./pages/PageFour.tsx\")));\nconst PageUnused = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().lazy(()=>__webpack_require__.e(/*! import() */ \"pages_PageUnused_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! ../../pages/PageUnused */ \"./pages/PageUnused.tsx\")));\nfunction App(props) {\n    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Routes, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Route, {\n        path: _constants__WEBPACK_IMPORTED_MODULE_1__.ROUTES.Two,\n        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageTwo, null)\n    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Route, {\n        path: `${_constants__WEBPACK_IMPORTED_MODULE_1__.ROUTES.Three}/:id?`,\n        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageThree, null)\n    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Route, {\n        path: _constants__WEBPACK_IMPORTED_MODULE_1__.ROUTES.Four,\n        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageFour, null)\n    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Route, {\n        path: _constants__WEBPACK_IMPORTED_MODULE_1__.ROUTES.Unused,\n        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageUnused, null)\n    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Route, {\n        path: \"*\",\n        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageOne, null)\n    }));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0FwcC9BcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEwQjtBQUN1QjtBQUVSO0FBQ3pDLE1BQU1JLHdCQUFVSixpREFBVSxDQUFDLElBQU0sZ0tBQU87QUFDeEMsTUFBTU0sd0JBQVVOLGlEQUFVLENBQUMsSUFBTSxnS0FBTztBQUN4QyxNQUFNTywwQkFBWVAsaURBQVUsQ0FBQyxJQUFNLGtRQUFPO0FBQzFDLE1BQU1RLHlCQUFXUixpREFBVSxDQUFDLElBQU0sbUtBQU87QUFDekMsTUFBTVMsMkJBQWFULGlEQUFVLENBQUMsSUFBTSx5S0FBTztBQUUzQyxTQUFTVSxJQUFJQyxLQUFtQjtJQUM5QixxQkFDRSwyREFBQ1Qsb0RBQU1BLHNCQUNMLDJEQUFDRCxtREFBS0E7UUFBQ1csTUFBTVQsOENBQU1BLENBQUNVLEdBQUc7UUFBRUMsdUJBQVMsMkRBQUNSO3NCQUNuQywyREFBQ0wsbURBQUtBO1FBQUNXLE1BQU0sQ0FBQyxFQUFFVCw4Q0FBTUEsQ0FBQ1ksS0FBSyxDQUFDLEtBQUssQ0FBQztRQUFFRCx1QkFBUywyREFBQ1A7c0JBRy9DLDJEQUFDTixtREFBS0E7UUFBQ1csTUFBTVQsOENBQU1BLENBQUNhLElBQUk7UUFBRUYsdUJBQVMsMkRBQUNOO3NCQUVwQywyREFBQ1AsbURBQUtBO1FBQUNXLE1BQU1ULDhDQUFNQSxDQUFDYyxNQUFNO1FBQUVILHVCQUFTLDJEQUFDTDtzQkFHdEMsMkRBQUNSLG1EQUFLQTtRQUFDVyxNQUFLO1FBQUlFLHVCQUFTLDJEQUFDVjs7QUFHaEM7QUFFQSxpRUFBZU0sR0FBR0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2htY2NsaW5pYy1za2VsZXRvbi1hcHAvLi9jb21wb25lbnRzL0FwcC9BcHAudHN4PzJjNmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFJvdXRlLCBSb3V0ZXMgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IEFwcFJvb3RQcm9wcyB9IGZyb20gJ0BncmFmYW5hL2RhdGEnO1xuaW1wb3J0IHsgUk9VVEVTIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmNvbnN0IFBhZ2VPbmUgPSBSZWFjdC5sYXp5KCgpID0+IGltcG9ydCgnLi4vLi4vcGFnZXMvUGFnZU9uZScpKTtcbmNvbnN0IFBhZ2VUd28gPSBSZWFjdC5sYXp5KCgpID0+IGltcG9ydCgnLi4vLi4vcGFnZXMvUGFnZVR3bycpKTtcbmNvbnN0IFBhZ2VUaHJlZSA9IFJlYWN0LmxhenkoKCkgPT4gaW1wb3J0KCcuLi8uLi9wYWdlcy9QYWdlVGhyZWUnKSk7XG5jb25zdCBQYWdlRm91ciA9IFJlYWN0LmxhenkoKCkgPT4gaW1wb3J0KCcuLi8uLi9wYWdlcy9QYWdlRm91cicpKTtcbmNvbnN0IFBhZ2VVbnVzZWQgPSBSZWFjdC5sYXp5KCgpID0+IGltcG9ydCgnLi4vLi4vcGFnZXMvUGFnZVVudXNlZCcpKTtcblxuZnVuY3Rpb24gQXBwKHByb3BzOiBBcHBSb290UHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8Um91dGVzPlxuICAgICAgPFJvdXRlIHBhdGg9e1JPVVRFUy5Ud299IGVsZW1lbnQ9ezxQYWdlVHdvIC8+fSAvPlxuICAgICAgPFJvdXRlIHBhdGg9e2Ake1JPVVRFUy5UaHJlZX0vOmlkP2B9IGVsZW1lbnQ9ezxQYWdlVGhyZWUgLz59IC8+XG5cbiAgICAgIHsvKiBGdWxsLXdpZHRoIHBhZ2UgKHRoaXMgcGFnZSB3aWxsIGhhdmUgbm8gc2lkZSBuYXZpZ2F0aW9uKSAqL31cbiAgICAgIDxSb3V0ZSBwYXRoPXtST1VURVMuRm91cn0gZWxlbWVudD17PFBhZ2VGb3VyIC8+fSAvPlxuXG4gICAgICA8Um91dGUgcGF0aD17Uk9VVEVTLlVudXNlZH0gZWxlbWVudD17PFBhZ2VVbnVzZWQgLz59IC8+XG5cbiAgICAgIHsvKiBEZWZhdWx0IHBhZ2UgKi99XG4gICAgICA8Um91dGUgcGF0aD1cIipcIiBlbGVtZW50PXs8UGFnZU9uZSAvPn0gLz5cbiAgICA8L1JvdXRlcz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwiUm91dGUiLCJSb3V0ZXMiLCJST1VURVMiLCJQYWdlT25lIiwibGF6eSIsIlBhZ2VUd28iLCJQYWdlVGhyZWUiLCJQYWdlRm91ciIsIlBhZ2VVbnVzZWQiLCJBcHAiLCJwcm9wcyIsInBhdGgiLCJUd28iLCJlbGVtZW50IiwiVGhyZWUiLCJGb3VyIiwiVW51c2VkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/App/App.tsx\n");

/***/ }),

/***/ "./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PLUGIN_BASE_URL: () => (/* binding */ PLUGIN_BASE_URL),\n/* harmony export */   ROUTES: () => (/* binding */ ROUTES)\n/* harmony export */ });\n/* harmony import */ var _plugin_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugin.json */ \"./plugin.json\");\n\nconst PLUGIN_BASE_URL = `/a/${_plugin_json__WEBPACK_IMPORTED_MODULE_0__.id}`;\nvar ROUTES;\n(function(ROUTES) {\n    ROUTES[\"One\"] = \"one\";\n    ROUTES[\"Two\"] = \"two\";\n    ROUTES[\"Three\"] = \"three\";\n    ROUTES[\"Four\"] = \"four\";\n    ROUTES[\"Unused\"] = \"unused\";\n})(ROUTES || (ROUTES = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25zdGFudHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXVDO0FBRWhDLE1BQU1DLGtCQUFrQixDQUFDLEdBQUcsRUFBRUQsNENBQWEsQ0FBQyxDQUFDLENBQUM7O1VBRXpDRzs7Ozs7O0dBQUFBLFdBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1jY2xpbmljLXNrZWxldG9uLWFwcC8uL2NvbnN0YW50cy50cz8zNzdmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbHVnaW5Kc29uIGZyb20gJy4vcGx1Z2luLmpzb24nO1xuXG5leHBvcnQgY29uc3QgUExVR0lOX0JBU0VfVVJMID0gYC9hLyR7cGx1Z2luSnNvbi5pZH1gO1xuXG5leHBvcnQgZW51bSBST1VURVMge1xuICBPbmUgPSAnb25lJyxcbiAgVHdvID0gJ3R3bycsXG4gIFRocmVlID0gJ3RocmVlJyxcbiAgRm91ciA9ICdmb3VyJyxcbiAgVW51c2VkID0gJ3VudXNlZCdcbn1cbiJdLCJuYW1lcyI6WyJwbHVnaW5Kc29uIiwiUExVR0lOX0JBU0VfVVJMIiwiaWQiLCJST1VURVMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./constants.ts\n");

/***/ }),

/***/ "./plugin.json":
/*!*********************!*\
  !*** ./plugin.json ***!
  \*********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://raw.githubusercontent.com/grafana/grafana/main/docs/sources/developers/plugins/plugin.schema.json","type":"app","name":"Skeleton","id":"hmcclinic-skeleton-app","backend":true,"executable":"gpx_skeleton","info":{"keywords":["app"],"description":"","author":{"name":"Hmcclinic"},"logos":{"small":"img/logo.svg","large":"img/logo.svg"},"screenshots":[],"version":"%VERSION%","updated":"%TODAY%"},"includes":[{"type":"page","name":"Page One","path":"/a/%PLUGIN_ID%/one","role":"Admin","addToNav":true,"defaultNav":true},{"type":"page","name":"Page Two","path":"/a/%PLUGIN_ID%/two","role":"Admin","addToNav":true,"defaultNav":false},{"type":"page","name":"Page Three","path":"/a/%PLUGIN_ID%/three","role":"Admin","addToNav":true,"defaultNav":false},{"type":"page","name":"Page Four","path":"/a/%PLUGIN_ID%/four","role":"Admin","addToNav":true,"defaultNav":false},{"type":"page","icon":"cog","name":"Configuration","path":"/plugins/%PLUGIN_ID%","role":"Admin","addToNav":true},{"type":"page","name":"Unused Page","path":"/a/%PLUGIN_ID%/unused","role":"Admin","addToNav":true,"defaultNav":false}],"dependencies":{"grafanaDependency":">=10.4.0","plugins":[]}}');

/***/ })

}]);