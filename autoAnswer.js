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

/*
每次运行，检查是否已经加载题库，没有就加载
调用getQuestionNumber()，获取题号
调用findAnswerById()，从题库中获取答案
返回答案string
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

    console.log("runAnswerFinder():题目ID="+currentQuestionId);
    // 3. 查找答案
    const finalAnswer = findAnswerById(window.questionBank, currentQuestionId);

    //返回结果
    return finalAnswer;
}






/**
 * 使用 document.querySelectorAll 获取页面上所有 class 为 "chosenItem" 的元素。
 *
 * @returns {NodeList} 包含所有匹配元素的 NodeList 对象。
 */
function getChosenItems() {
    // 使用 CSS 选择器 .chosenItem 来匹配所有 class 包含 chosenItem 的元素
    const chosenItems = document.querySelectorAll('.chosenItem');
    return chosenItems;
}

function checkOptionsList(optionsList) {
    // 2. 检查是否成功获取到元素
    if (optionsList.length > 0) {
        console.log(`成功获取到 ${optionsList.length} 个选项元素。`);

        // 3. 示例：遍历并输出每个选项的内容或属性
        // optionsList.forEach((item, index) => {
        //     console.log(`--- 选项 ${index + 1} ---`);
        //     console.log("元素文本内容:", item.textContent.trim());
        // });
        return true;
    } else {
        console.log("未在页面上找到任何 class='chosenItem' 的元素。请检查类名是否拼写正确，或元素是否已加载。");
        return false;
    }
}


function simulateChoice(items, ans) {
    console.log("simulateChoice():获取到答案  "+ans);
    if (!items || items.length !== 4) {
        console.error('NodeList 必须包含恰好 4 个元素');
        return;
    }

    // 将字母映射到对应的索引（0‑3）
    const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const index = map[ans];

    if (index === undefined) {
        console.error('ans 必须是 "A"、"B"、"C" 或 "D"');
        return;
    }

    const target = items[index];
    if (!target) {
        console.warn('未找到对应的元素');
        return;
    }

    // 触发原生 click 事件（兼容大多数浏览器）
    if (typeof target.click === 'function') {
        target.click();                     // 简单方式
    } else {
        // 手动创建并分发事件（更通用）
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        target.dispatchEvent(event);
    }

    console.log(`已模拟点击第 ${index + 1} 项（对应 ${ans}）`);
}



function creatButton() {
    const btn = document.createElement('button');
    btn.textContent = 'ASP';
    // 基本样式，使按钮固定在右下角
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
        fontSize: '14px'
    });
    document.body.appendChild(btn);

    // 鼠标点击
    btn.addEventListener('click', autoAns);

    // Enter 键（在页面任意位置按下时触发）
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            // 防止在输入框等可编辑元素中触发
            const active = document.activeElement;
            const isEditable = active && (active.isContentEditable ||
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName));
            if (!isEditable) {
                autoAns();
            }
        }
    });

}


async function autoAns() {
    console.log('函数 autoAns 被调用');
    const ans = await runAnswerFinder();
    const items = getChosenItems();
    if (checkOptionsList(items)) {
        setTimeout(simulateChoice(items, ans),500);
        
    }
}

creatButton();
