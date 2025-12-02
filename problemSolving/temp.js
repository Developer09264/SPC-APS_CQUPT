function getContent() {
    const element = document.getElementById('ProgramContent');

    if (!element) {
        console.error("ProgramContent not fond");
        return;
    }
    let extractedText = "";
    element.childNodes.forEach(node => {
        if (node.nodeType === 3) {
            extractedText += node.nodeValue;
        }
        else if (node.nodeType === 1 && node.tagName === 'BR') {
            extractedText += '\n';
        }
    });

    const cleanedText = extractedText.replace(/\u3000/g, ' ');
    // console.log("extrated, cleaned text:\n", cleanedText);
    return cleanedText;
}
function getQuestion() {
    const element = document.getElementById('QuestionContent');

    if (!element) {
        console.error("QuestionContent not fond");
        return;
    }
    let extractedText = "";
    element.childNodes.forEach(node => {
        if (node.nodeType === 3) {
            extractedText += node.nodeValue;
        }
        else if (node.nodeType === 1 && node.tagName === 'BR') {
            extractedText += '\n';
        }
    });

    const cleanedText = extractedText.replace(/\u3000/g,' ');

    return cleanedText;

}

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


function buildPrompt(){
    return (getContent() + "\n\nID:"+ getQuestionNumber()+"\n\n" + getQuestion() +"\n\n--------------------\n");
}

function main() {
    // --- 修复1：添加兼容性复制函数 (解决复制失败问题) ---
    function copyToClipboard(text, successCallback, errorCallback) {
        // 优先尝试现代 API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(successCallback)
                .catch(() => {
                    // 失败则尝试降级方案
                    fallbackCopy(text, successCallback, errorCallback);
                });
        } else {
            // 不支持则直接使用降级方案
            fallbackCopy(text, successCallback, errorCallback);
        }
    }

    function fallbackCopy(text, successCallback, errorCallback) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // 确保 textarea 不可见但存在于 DOM 中
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                successCallback();
            } else {
                errorCallback('execCommand 返回 false');
            }
        } catch (err) {
            errorCallback(err);
        }
        
        document.body.removeChild(textArea);
    }

    // 2. 注入 CSS 样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 右下角触发按钮样式 */
        #my-fixed-trigger-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #my-fixed-trigger-btn:hover {
            transform: scale(1.1);
            background-color: #0056b3;
        }

        /* 弹窗遮罩层 */
        #my-custom-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            display: none; /* 默认隐藏 */
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        /* 弹窗主体 */
        #my-custom-modal {
            background: white;
            width: 90%;
            max-width: 400px;
            padding: 20px;
            border-radius: 12px;
            position: relative;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            gap: 15px;
            transform: scale(0.8);
            transition: transform 0.3s;
        }
        
        /* 激活状态 */
        #my-custom-modal-overlay.active {
            opacity: 1;
        }
        #my-custom-modal-overlay.active #my-custom-modal {
            transform: scale(1);
        }

        /* 右上角关闭按钮 */
        #my-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            color: #888;
            cursor: pointer;
            line-height: 1;
        }
        #my-modal-close:hover {
            color: #333;
        }

        /* 顶部大复制按钮 */
        #my-copy-btn {
            width: 100%;
            padding: 12px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        #my-copy-btn:hover {
            background-color: #218838;
        }
        #my-copy-btn:active {
            transform: translateY(1px);
        }

        /* 文本内容区域 */
        #my-text-content {
            background: #f8f9fa;
            padding: 10px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-family: monospace;
            white-space: pre-wrap; /* 保留换行 */
            color: #333;
            max-height: 200px;
            overflow-y: auto;
            word-break: break-all;
        }
    `;
    document.head.appendChild(style);

    // 3. 创建 HTML 结构
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'my-fixed-trigger-btn';
    triggerBtn.innerText = '#';
    document.body.appendChild(triggerBtn);

    const overlay = document.createElement('div');
    overlay.id = 'my-custom-modal-overlay';
    overlay.innerHTML = `
        <div id="my-custom-modal">
            <div id="my-modal-close">&times;</div>
            <button id="my-copy-btn">点击复制全文</button>
            <div id="my-text-content"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 4. 绑定事件逻辑
    const modal = overlay.querySelector('#my-custom-modal');
    const closeBtn = overlay.querySelector('#my-modal-close');
    const copyBtn = overlay.querySelector('#my-copy-btn');
    const textContentDiv = overlay.querySelector('#my-text-content');

    // --- 修复2：打开弹窗时才去获取内容 (解决文本不更新问题) ---
    triggerBtn.addEventListener('click', () => {
        // 动态调用函数获取最新文本
        const latestContent = buildPrompt();
        
        // 更新弹窗内容
        textContentDiv.innerText = latestContent;

        // 显示弹窗
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    });

    // 关闭弹窗函数
    const closeModal = () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300); // 等待动画结束
    };

    closeBtn.addEventListener('click', closeModal);
    
    // 点击遮罩层背景关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // 复制功能
    copyBtn.addEventListener('click', () => {
        const originalText = "点击复制全文"; 
        // 从当前显示的 DOM 中获取文本，确保一致性
        const textToCopy = textContentDiv.innerText;

        copyToClipboard(
            textToCopy,
            () => { // 成功回调
                copyBtn.innerText = "✅ 复制成功！";
                copyBtn.style.backgroundColor = "#155724";
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.backgroundColor = "#28a745";
                }, 2000);
            },
            (err) => { // 失败回调
                console.error('复制失败: ', err);
                copyBtn.innerText = "❌ 复制失败";
                copyBtn.style.backgroundColor = "#dc3545";
                alert('复制失败，请手动复制下方文字。');
            }
        );
    });
};
main();