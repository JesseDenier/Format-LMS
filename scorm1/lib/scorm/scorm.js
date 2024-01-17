/**
 * @name vijua-scorm
 * @version 0.1.0
 * @copyright 2022
 * @author Vijua
 * @license MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else if (typeof define === "function" && define.amd) define(factory);
  else root.VijuaScorm = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function VijuaScorm() {
    var $this = this;

    var version = "Auto";
    var API = false;
    var scormVersions = ["Auto", "1.2", "2004"];

    $this.setAPIVersion = function (scormVersion) {
      scormVersion = scormVersion || "Auto";

      var v = scormVersions.indexOf(scormVersion.toString());
      v > -1 ? (version = scormVersions[v]) : console.log("Not found, default to Auto");
      return version;
    };

    $this.getAPIVersion = function () {
      return version;
    };

    $this.isAvailable = function () {
      return true;
    };

    $this.doLMSInitialize = function () {
      return $this.cmiBooleanToJs($this.getAPICall("LMSInitialize", "Initialize")(""));
    };

    $this.doLMSFinish = function () {
      return $this.cmiBooleanToJs($this.getAPICall("LMSFinish", "Terminate")(""));
    };

    $this.doLMSGetValue = function (parameter) {
      return $this.getAPICall("LMSGetValue", "GetValue")(parameter);
    };

    $this.doLMSSetValue = function (parameter, value) {
      return $this.cmiBooleanToJs($this.getAPICall("LMSSetValue", "SetValue")(parameter, value));
    };

    $this.doLMSCommit = function () {
      return $this.cmiBooleanToJs($this.getAPICall("LMSCommit", "Commit")(""));
    };

    $this.doLMSGetLastError = function () {
      return $this.getAPICall("LMSGetLastError", "GetLastError")();
    };

    $this.doLMSGetErrorString = function (errorCode) {
      return $this.getAPICall("LMSGetErrorString", "GetErrorString")(errorCode.toString());
    };

    $this.doLMSGetDiagnostic = function (errorCode) {
      return $this.getAPICall("LMSGetDiagnostic", "GetDiagnostic")(errorCode.toString());
    };

    $this.LMSIsInitialized = function () {
      return API;
    };

    $this.ErrorHandler = function () {
      return $this.getAPICall("LMSGetLastError", "GetLastError")();
    };

    $this.cmiBooleanToJs = function (value) {
      return value === "1" || value === 1 || value === "true" || value === true;
    };

    $this.getAPIHandle = function () {
      var win = window;

      if (win.parent && win.parent != win) {
        $this.findAPI(win.parent);
      }

      if (!API && win.top.opener) {
        $this.findAPI(win.top.opener);
      } else if (!API) {
        console.log("Unable to find API adapter");
      }
    };

    $this.findAPI = function (win) {
      var findAttempts = 0,
        findAttemptLimit = 500;

      for (findAttempts; findAttempts < findAttemptLimit; findAttempts++) {
        if (win.API && (version === "1.2" || version === "Auto")) {
          API = win.API;
          version = "1.2";
          break;
        } else if (win.API_1484_11 && (version === "2004" || version === "Auto")) {
          API = win.API_1484_11;
          version = "2004";
          break;
        } else if (win.parent && win.parent != win) {
          findAttempts++;
          win = win.parent;
        }
      }
    };

    $this.getAPICall = function (funcname12, funcname2004) {
      if (!API) {
        $this.getAPIHandle();
        if (!API) {
          return function () {
            console.log("No API found, can't execute: " + funcname12 + " or " + funcname2004);
          };
        }
      }

      switch (version) {
        case "2004":
          return function () {
            return API[funcname2004].apply(API, arguments);
          };

        case "1.2":
          return function () {
            return API[funcname12].apply(API, arguments);
          };
      }
    };
  }

  return VijuaScorm;
});
