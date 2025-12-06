// ==UserScript==
// @name         题库美化脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gemini写的
// @match        http://172.22.214.200/ctas/CPractice.aspx
// @run-at       document-end
// @grant        none
// @downloadURL  https://github.com/Developer09264/SPC-APS_CQUPT/raw/refs/heads/main/userStyle.js
// @updateURL    https://github.com/Developer09264/SPC-APS_CQUPT/raw/refs/heads/main/userStyle.js
// ==/UserScript==

(function () {
    'use strict';
    const css = `

:root {
    --app-bg: #F5F5F7; /* Apple 浅灰背景 */
    --glass-bg: rgba(255, 255, 255, 0.75);
    --glass-border: rgba(255, 255, 255, 0.4);
    --accent-color: #007AFF; /* Apple Blue */
    --accent-hover: #0056b3;
    --text-primary: #1D1D1F;
    --text-secondary: #86868B;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
    --radius-lg: 18px;
    --radius-md: 12px;
}

/* --- 全局重置与字体 --- */
body {
    margin: 0;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    background-color: #eef2f5;
    /* 梦幻渐变背景 */
    background-image: 
        radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
        radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
}

/* 移除旧的表格默认间距 */
table {
    border-collapse: separate;
    border-spacing: 0 15px; /* 增加列间距 */
}

td {
    vertical-align: top;
}

/* --- 主容器 (模拟 macOS 窗口) --- */
.page {
    width: 1050px !important; /*稍微加宽以适应现代屏幕*/
    margin: 5ex auto;
    padding: 30px;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.6);
}

/* --- 左侧侧边栏 --- */
/* 设置练习参数区域 */
.topicTitle {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    font-weight: 600;
    margin-bottom: 10px;
    margin-left: 5px;
}

/* 侧边栏卡片 */
.page td:first-child > div > div {
    background: rgba(255, 255, 255, 0.5);
    border-radius: var(--radius-lg);
    padding: 20px;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-sm);
}

/* 移除旧边框 */
div[style*="border: 1px #686868 solid"] {
    border: none !important;
}

/* 章节选择/程序选择 标题 */
.itemTitle {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
}

/* 下拉菜单 Select 美化 */
select {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    color: var(--text-primary);
    outline: none;
    appearance: none; /* 移除默认样式 */
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    transition: all 0.2s;
    margin-bottom: 5px;
    cursor: pointer;
}

select:hover {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

select:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}

/* 错误提示 */
.errorMessage {
    color: #FF3B30;
    font-size: 12px;
    margin-bottom: 15px;
    display: block;
}

/* 按钮组 */
.topicBottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: auto;
    background: #fff0;
    padding-top: 0;
    padding-bottom: 0;
}

/* 上一题/下一题 按钮 - iOS 风格 */
.normalButton {
    background: var(--accent-color);
    background: linear-gradient(180deg, #3395ff 0%, #007aff 100%);
    border: none;
    color: white;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px; /* 胶囊形状 */
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 122, 255, 0.3);
    transition: all 0.2s ease;
    width: 48%; /* 并排显示 */
}

.normalButton:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 122, 255, 0.4);
    filter: brightness(1.05);
}

.normalButton:active {
    transform: translateY(0);
    filter: brightness(0.9);
}

/* --- 右侧内容区域 --- */

/* 内容块容器 (程序、问题、选项) */
#divProgram, #divQuestion, #divChosenItems {
    background: #fff;
    border-radius: var(--radius-lg);
    padding: 24px;
    margin: 0 0 20px 20px !important; /* 覆盖 inline margin */
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0,0,0,0.03);
    transition: transform 0.3s ease;
}

#divProgram:hover, #divQuestion:hover, #divChosenItems:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

/* 标题栏 */
.listTitle {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 5px;
    position: relative;
    display: inline-block;
}

.list2ndTitle {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 400;
    margin-left: 10px;
}

/* 装饰性图标 (替代原本空的 listSymbol) */
.listSymbol {
    float: left;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #FF9500, #FF5E3A); /* 默认橙色 */
    border-radius: 8px;
    margin-right: 12px;
    box-shadow: 0 2px 5px rgba(255, 149, 0, 0.3);
}

/* 不同板块不同颜色图标 */
#divProgram .listSymbol { background: linear-gradient(135deg, #5AC8FA, #007AFF); box-shadow: 0 2px 5px rgba(0, 122, 255, 0.3); }
#divQuestion .listSymbol { background: linear-gradient(135deg, #4CD964, #34AADC); box-shadow: 0 2px 5px rgba(52, 170, 220, 0.3); }
#divChosenItems .listSymbol { background: linear-gradient(135deg, #FFCC00, #FF9500); box-shadow: 0 2px 5px rgba(255, 204, 0, 0.3); }

/* 内容文本区域 */
.listContent {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace; /* 代码风格字体 */
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    background: #FAFAFA;
    padding: 15px;
    border-radius: var(--radius-md);
    border: 1px solid #E5E5E5;
    margin-top: 15px;
    overflow-x: auto;
}

/* --- 选项按钮 (A, B, C, D) --- */
.chosenItem {
    display: inline-block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    margin-right: 20px;
    background: #fff;
    border-radius: 16px; /* 类似于 iOS App 图标 */
    font-size: 24px;
    font-weight: bold;
    color: var(--text-primary);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
}

/* 选项渐变背景 */
.chosenItem:nth-of-type(1) { color: #FF3B30; } /* A - Red */
.chosenItem:nth-of-type(2) { color: #FF9500; } /* B - Orange */
.chosenItem:nth-of-type(3) { color: #34C759; } /* C - Green */
.chosenItem:nth-of-type(4) { color: #007AFF; } /* D - Blue */

.chosenItem:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(0,0,0,0.12);
    background: #fff;
}

/* 激活态（点击时） */
.chosenItem:active {
    transform: scale(0.95);
    background: #f0f0f0;
}

/* --- 弹窗样式 (信息窗口) --- */
/* 强制覆盖内联样式 */
#divInfoWindow {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
    width: 600px !important;
    height: auto !important;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(25px) !important;
    border-radius: 20px !important;
    box-shadow: 0 25px 50px rgba(0,0,0,0.25) !important;
    border: 1px solid rgba(255,255,255,0.5) !important;
    z-index: 1000;
    overflow: hidden;
    padding: 0 !important;
}

/* 隐藏原本丑陋的背景图片 */
#divInfoWindow > div:first-child,
#divInfoWindow > div:last-child {
    display: none !important; 
}

/* 弹窗内容重置 */
#divInfo {
    border: none !important;
    padding: 30px !important;
    width: 100% !important;
    max-width: none !important;
    height: auto !important;
    max-height: 400px;
    background: transparent !important;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.6;
}

/* 解题技巧部分 */
#divAnswerSummary {
    margin-top: 20px;
    background: rgba(255,255,255,0.6);
    border-radius: var(--radius-md);
    padding: 20px;
    border: 1px dashed var(--accent-color);
}


    `;

    const cssStyles = `
        /* 代码容器样式 */
        .pretty-code-box {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            background-color: #ffffff;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            color: #24292e;
            padding: 10px;
            margin: 0 0;
            overflow-x: auto;
            text-align: left; /* 强制左对齐 */
        }
        
        /* 有序列表实现行号 */
        .pretty-code-box ol {
            list-style: decimal;
            margin: 0;
            padding: 0 0 0 40px;
            color: #858585ff;; /* 行号颜色 */
            border-left: 1px solid #eaecef;
        }

        .pretty-code-box li {
            padding-left: 10px; /* 代码跟行号的距离 */
            background: #fff;
            white-space: pre; /* 保留空格格式 */
        }
        
        .pretty-code-box li:nth-child(even) {
            background-color: #f6f8fa; /* 斑马纹背景 */
        }

        /* 语法高亮配色 (Light Theme) */
        .hl-keyword { color: #d73a49; font-weight: bold; } /* int, void */
        .hl-string  { color: #36a96aff; } /* "String" */
        .hl-comment { color: #6a737d; font-style: italic; } /* // Comment */
        .hl-header  { color: #6f42c1; } /* #include */
        .hl-lib     { color: #005cc5; } /* iostream */
        .hl-object  { color: #005cc5; } /* cout, cin */
        .hl-symbol  { color: #24292e; } /* << >> ; */
    `;
    const style = document.createElement('style');
    style.id = 'my-inline-css';
    style.type = 'text/css';
    style.textContent = css + cssStyles;
    document.head.appendChild(style);

    document.getElementById('ProgramContent').style.padding = '5px';

    function removeTitle() {
        const el = document.getElementById('cChapter');

        const parent = el.parentElement.parentElement.parentElement.parentElement;

        // 找到父元素的第一个子元素是 div 时删除；若第一个子节点不是元素节点则查找第一个子元素
        const firstChildElement = parent.firstElementChild;
        if (firstChildElement && firstChildElement.tagName.toLowerCase() === 'div') {
            parent.removeChild(firstChildElement);
            // console.log('Removed Title');
        }
    }
    removeTitle();

    function advancedCode(rawHtml) {

        // ==========================================
        // 2. 代码处理逻辑
        // ==========================================
        //接受原始html,返回经处理的html,依赖上面的style
        function transformCodeHtml(rawHtml) {

            const codeText = rawHtml
                .replace(/\<br\>/g, '\n')
                .replace(/^\s*\d{1,2}\)/gm, '')
                .replace(/\u3000/g, ' ');

            // console.log("\nrawHtml:\n" + codeText + "\n");


            // --- B. 按行处理与高亮 ---
            const lines = codeText.split('\n');
            let newHtml = '<div class="pretty-code-box"><ol>';

            // 辅助：防止高亮后的 HTML 再次被转义，我们需要先转义基础字符，再包裹 span
            function escapeHtml(text) {
                return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }

            lines.forEach(line => {
                let processedLine = line;

                // console.log("\nafter processedLine:\n" + processedLine);

                // 2. 应用高亮逻辑
                // 这是一个简易替换逻辑：先处理整行匹配（如注释），再处理单词

                // 如果包含 //，先分离注释，避免匹配到注释里的关键字
                if (line.includes('//')) {
                    const parts = processedLine.split('//');
                    const codePart = highlightKeywords(parts[0]);
                    // 恢复注释部分（加颜色）
                    const commentPart = '<span class="hl-comment">//' + parts.slice(1).join('//') + '</span>';
                    processedLine = codePart + commentPart;
                } else if (line.trim().startsWith('#include')) {
                    // 特殊处理 include 行
                    processedLine = processedLine.replace(
                        /(#include)\s*(?:(&lt;.*?&gt;|&quot;.*?&quot;))/,
                        '<span class="hl-header">$1</span> <span class="hl-lib">$2</span>'
                    );
                } else {
                    // 普通代码行
                    processedLine = highlightKeywords(processedLine);
                }

                newHtml += `<li>${processedLine}</li>`;
            });

            newHtml += '</ol></div>';

            return newHtml;
        }

        // 内部函数：高亮普通关键字
        function highlightKeywords(str) {
            // console.log("before highlightKeywords:\n" + str);
            let res = str;
            // 字符串高亮
            res = res.replace(/(&quot;.*?&quot;)/g, '<span class="hl-string">$1</span>');
            // 关键字高亮 (避开已经在标签里的内容，这里简单处理)
            // 注意：因为已经转义过，不会破坏 HTML 标签
            const keywords = /\b(void|int|struct|const|long|short|float|double|char|return|using|namespace|for|while|do|break|continue|else)\b/g;
            res = res.replace(keywords, '<span class="hl-keyword">$1</span>');

            const objects = /\b(cout|cin|endl)\b/g;
            res = res.replace(objects, '<span class="hl-object">$1</span>');

            return res;
        }

        return transformCodeHtml(rawHtml);

    }

    formatLineNumber = advancedCode;

})();
