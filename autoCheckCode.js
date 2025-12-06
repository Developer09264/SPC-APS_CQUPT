// ==UserScript==
// @name         autoCheckCode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  结构化程序设计题库登陆界面自动填写验证码
// @match        http://172.22.214.200/ctas/login.aspx
// @run-at       document-end
// @grant        none
// @downloadURL  https://github.com/Developer09264/SPC-APS_CQUPT/blob/main/userStyle.js
// @updateURL    https://github.com/Developer09264/SPC-APS_CQUPT/blob/main/userStyle.js
// ==/UserScript==

(function () {
    'use strict';

    //验证码是全局变量code
    function autoCheckCode() {
        document.getElementById("iptCode").value = "验证码";
        rmCheckCode();
        checkCode.value = "你猜";
    }

    function rmCheckCode() {
        window.validate = function () {
            return true;
        }
    }

    document.getElementById("ipUserName").addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            Login();
        }
    }); document.getElementById("ipPassword").addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            Login();
        }
    });

    document.addEventListener('DOMContentLoaded', autoCheckCode());
})();