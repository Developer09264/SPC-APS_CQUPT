// ==UserScript==
// @name         ASP 自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自动从 GitHub 题库获取答案并自动选择
// @match        http://172.22.214.200/ctas/CPractice.aspx
// @run-at       document-end
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Developer09264/SPC-APS_CQUPT/main/autoAnswer.js
// @updateURL    https://raw.githubusercontent.com/Developer09264/SPC-APS_CQUPT/main/autoAnswer.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------------------------------------
    // 配置
    // -------------------------------------------------------------
    const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Developer09264/SPC-APS_CQUPT/main/ans.json';
    const POPUP_DISPLAY_TIME_MS = 2000;

    window.questionBank = null;


    function getQuestionNumber() {
        const questionContent = document.getElementById('QuestionContent');
        if (!questionContent) return null;

        const firstSpan = questionContent.querySelector('div span:first-child');
        if (!firstSpan) return null;

        const textContent = firstSpan.textContent;
        const match = textContent.match(/\[(\d+)\]/);

        return (match && match[1]) ? match[1] : null;
    }

    async function loadQuestionBank() {
        console.log("正在从 GitHub 加载题库数据...");
        try {
            const response = await fetch(GITHUB_JSON_URL);

            if (!response.ok) {
                throw new Error(`HTTP 错误！状态码: ${response.status}`);
            }

            const bank = await response.json();
            console.log("题库数据加载成功！");
            return bank;

        } catch (error) {
            console.error("loadQuestionBank: 加载题库时发生错误:", error);
            return null;
        }
    }

    function findAnswerById(questionBank, questionId) {
        if (!questionBank || !questionId) return null;
        return questionBank[questionId] || null;
    }

    async function runAnswerFinder() {
        if (!window.questionBank) {
            const bank = await loadQuestionBank();
            if (!bank) {
                alert("❌ 题库加载失败！");
                return null;
            }
            window.questionBank = bank;
        }

        const currentQuestionId = getQuestionNumber();
        if (!currentQuestionId) {
            alert("❌ 无法读取题号");
            return null;
        }

        console.log("题号解析结果:", currentQuestionId);
        return findAnswerById(window.questionBank, currentQuestionId);
    }

    function getChosenItems() {
        return document.querySelectorAll('.chosenItem');
    }

    function checkOptionsList(optionsList) {
        if (optionsList.length > 0) {
            console.log(`成功获取到 ${optionsList.length} 个选项`);
            return true;
        } else {
            console.log("未找到选项 .chosenItem");
            return false;
        }
    }

    function simulateChoice(items, ans) {
        console.log("simulateChoice(): 获取到答案", ans);

        if (!items || items.length !== 4) {
            console.error('NodeList 必须包含恰好 4 个元素');
            return;
        }

        const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const index = map[ans];

        if (index === undefined) {
            console.error("无效的答案字母：", ans);
            return;
        }

        const target = items[index];
        if (target) target.click();

        console.log(`已模拟点击选项 ${ans}`);
    }

    let autoRunning = false;   // 是否正在自动运行
    let autoTimer = null;      // 定时器引用

    function creatButton() {
        const btn = document.createElement('button');
        btn.textContent = 'ASP';

        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            padding: '10px 16px',
            backgroundColor: '#0063e5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 9999,
            fontSize: '14px',
            transition: '0.2s'
        });

        document.body.appendChild(btn);

        // 点击按钮切换状态
        btn.addEventListener('click', () => toggleAuto(btn));

    }

    // 切换自动运行状态
    function toggleAuto(btn) {
        if (!autoRunning) {
            // 开始自动运行
            autoRunning = true;
            btn.textContent = '运行中';
            btn.style.backgroundColor = '#13c213';  // 绿色运行状态

            // 立即执行一次
            autoAns();

            // 每 6 秒执行一次
            autoTimer = setInterval(autoAns, 6000);

            console.log("自动答题 已开启");

        } else {
            // 停止自动运行
            autoRunning = false;
            btn.textContent = 'ASP';
            btn.style.backgroundColor = '#0063e5';  // 恢复原色

            // 清除定时器
            clearInterval(autoTimer);
            autoTimer = null;

            console.log("自动答题 已关闭");
        }
    }


    async function autoAns() {
        console.log("autoAns() 调用");

        const ans = await runAnswerFinder();
        console.log("最终答案:", ans);

        if (!ans) {
            alert("❌ 此题无答案");
            return;
        }

        const items = getChosenItems();
        if (checkOptionsList(items)) {
            setTimeout(() => simulateChoice(items, ans), 500);
        }
    }

    creatButton();

})();
