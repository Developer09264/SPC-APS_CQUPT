// -------------------------------------------------------------
// 配置
// -------------------------------------------------------------
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Developer09264/SPC-APS_CQUPT/main/ans.json';
const POPUP_DISPLAY_TIME_MS = 2000; // 弹窗显示时间：2秒

// -------------------------------------------------------------
// 全局状态：用于存储加载一次的题库数据
// -------------------------------------------------------------
window.questionBank = null;

/**
 * 1. 从 HTML DOM 中提取当前的题目编号。
 * @returns {string | null} 题目编号字符串（例如："23229"），如果找不到则返回 null。
 */
function getQuestionNumber() {
    const questionContent = document.getElementById('QuestionContent');
    if (!questionContent) return null;

    // 查找包含题号文本的元素
    const firstSpan = questionContent.querySelector('div span:first-child');
    if (!firstSpan) return null;

    const textContent = firstSpan.textContent;
    // 匹配 [数字] 格式，并捕获数字部分
    const match = textContent.match(/\[(\d+)\]/);

    return (match && match[1]) ? match[1] : null;
}

/**
 * 2. 异步加载并解析 GitHub 上的题库 JSON 文件。
 * @returns {Promise<Object<string, string> | null>} 题库对象，如果失败则返回 null。
 */
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

/**
 * 3. 根据题号查找答案。
 * @param {Object<string, string>} questionBank 整个题库对象。
 * @param {string} questionId 要查找的题目编号。
 * @returns {string | null} 答案字符串（例如："D"），如果找不到则返回 null。
 */
function findAnswerById(questionBank, questionId) {
    if (!questionBank || !questionId) return null;
    return questionBank[questionId] || null;
}

/**
 * 4. 在页面右下角显示一个临时的弹窗。
 * @param {string} message 要显示的消息内容。
 * @param {boolean} isSuccess 用于颜色区分。
 */
function showAnswerPopup(message, isSuccess) {
    // 移除旧的弹窗，确保每次只有一个
    const existingPopup = document.getElementById('answer-finder-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'answer-finder-popup';
    popup.textContent = message;

    // 设置弹窗样式
    popup.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.5s ease-in-out;
        background-color: ${isSuccess ? '#4CAF50' : '#F44336'}; /* 绿色/红色 */
    `;

    document.body.appendChild(popup);

    // 2秒后自动删除弹窗
    setTimeout(() => {
        popup.style.opacity = '0'; // 开始淡出
        setTimeout(() => popup.remove(), 500); // 彻底移除
    }, POPUP_DISPLAY_TIME_MS);
}


/**
 * 5. 核心运行逻辑：先检查本地是否有数据，没有则加载。
 */
async function runAnswerFinder() {
    // 1. 检查是否需要加载题库
    if (!window.questionBank) {
        const bank = await loadQuestionBank();
        if (!bank) {
            showAnswerPopup("❌ 题库加载失败！请检查网络或链接。", false);
            return;
        }
        window.questionBank = bank; // 存储到全局变量，供下次使用
    }

    // 2. 提取当前页面的题目编号
    const currentQuestionId = getQuestionNumber();
    if (!currentQuestionId) {
        showAnswerPopup("❌ 无法提取页面题号！", false);
        return;
    }

    // 3. 查找答案
    const finalAnswer = findAnswerById(window.questionBank, currentQuestionId);

    // 4. 展示结果
    if (finalAnswer) {
        showAnswerPopup(`🎉 答案: ${finalAnswer} (ID: ${currentQuestionId})`, true);
    } else {
        showAnswerPopup(`🤔 未找到答案 (ID: ${currentQuestionId})`, false);
    }
}


/**
 * 6. 初始化：创建并配置右下角的按钮。
 */
function initializeButton() {
    const button = document.createElement('button');
    button.id = 'answer-finder-button';
    button.textContent = '🔍 查答案';

    // 设置按钮样式
    button.style.cssText = `
        position: fixed;
        bottom: 70px; /* 放在弹窗上方 */
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: background-color 0.2s;
    `;
    
    // 悬停效果
    button.onmouseover = () => button.style.backgroundColor = '#0056b3';
    button.onmouseout = () => button.style.backgroundColor = '#007bff';


    // 绑定点击事件
    button.onclick = runAnswerFinder;

    document.body.appendChild(button);
    console.log("✅ 答案查找按钮已初始化并添加到页面右下角。");
}

// 确保在 DOM 加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializeButton);
// 如果您的脚本是作为油猴脚本或直接注入的，可以立即执行 initializeButton()
initializeButton();