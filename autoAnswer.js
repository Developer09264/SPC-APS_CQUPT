function getQuestionNumber() {
    // 1. 获取包含题号的元素
    const questionContent = document.getElementById('QuestionContent');

    if (!questionContent) {
        console.error("未找到 id 为 'QuestionContent' 的元素。");
        return null;
    }

    // 2. 查找第一个子元素，通常它包含题号文本
    // 假设题号在第一个子div或span中
    const firstChild = questionContent.querySelector('div span:first-child');
    // 或者直接查找 div > span:first-child 来定位 [23229] 所在的元素

    if (!firstChild) {
        console.error("在 'QuestionContent' 中未找到题号所在的子元素。");
        return null;
    }

    // 3. 提取元素的文本内容
    const textContent = firstChild.textContent;

    // 4. 使用正则表达式匹配 [数字] 的格式
    // 正则表达式：/\[(\d+)\]/
    // - \[ 和 \] 匹配字面量的方括号
    // - (\d+) 匹配一个或多个数字，并将其捕获为一个分组
    const match = textContent.match(/\[(\d+)\]/);

    if (match && match[1]) {
        // match[0] 是整个匹配的字符串 (例如: "[23229]")
        // match[1] 是第一个捕获组，即方括号内的数字
        return match[1];
    } else {
        console.error("未在文本中找到格式为 [数字] 的题号。");
        return null;
    }
}