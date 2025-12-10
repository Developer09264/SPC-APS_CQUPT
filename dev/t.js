function makeChoice(selectValue) {
    if (isLogWrite.value == "true") {
        showInfoWindow("您已练习过该题目，请手动选择下一题！", 3, 'middle');
        return;
    }
    var vTestParam = '<cTestParam><cQuestion>' + cQuestionID.value + '</cQuestion><cUserAnswer>' + selectValue + '</cUserAnswer></cTestParam>';
    var IsOrNotTrue = CExam.CPractice.IsOrNotTrue(vTestParam);
    if (IsOrNotTrue.value) {

        console.log("正确！<br/>自动进入下一个问题");
        setTimeout(nextQuestion, 0);
        // autoAns();
    }
    else {

        var cSummaryInfo = eval('(' + CExam.CPractice.GetJSONSummary(vTestParam).value + ')');

        cAnswerSummary.innerHTML = HtmlDecode(cSummaryInfo.CQuestion.CAnswerSummary);

        console.log("\n***错误！***\n\n");
        setTimeout(nextQuestion, 0);
    }

    try {
        CExam.CPractice.WriteLog('<cTestParam><cQuestion>' + cQuestionID.value + '</cQuestion><cUserAnswer>' + selectValue + '</cUserAnswer></cTestParam>');
    }
    catch (ex) {
        ;
    }
    disableSelect();
    isLogWrite.value = 'true';
}



let accuracy = 1;


function nextQuestion() {
    //setTimeout(function() { window.top.location = 'login.htm'; }, 1000 * 60 * 5);

    if (isLogWrite.value == 'false') {
        //showInfoWindow('此题还未练习，无法读取下一题目！',3,'middle');
        // return;
    }

    // $("#divProgram").hide();
    // $("#divQuestion").hide();
    // $("#divChosenItems").hide();
    // $("#divAnswerSummary").hide();

    //  检查章节的选中的值是否有效
    if (cChapter.value == 'null') {
        $("#cChapterTips").show();
        return;
    }

    //  检查程序的选中的值是否有效
    if (cProgram.value == 'null') {
        $("#cProgramTips").show();
        return;
    }

    if (parseInt(cQuestionIndex.value) == parseInt(cQuestionCount.value) - 1) {
        if (cProgram.selectedIndex < cProgram.options.length - 1)
            cProgram.selectedIndex = cProgram.selectedIndex + 1;
        else {
            showInfoWindow("此章节下的程序已读取结束！<br/>请选择其他章节进行练习。", 3, "middle");
            return;
        }

        cQuestionIndex.value = -1;
    }

    //divInfo.innerHTML = '<div class="ordininfo">Loading......</div>';
    var vTestParam = '<cTest><cProgram>' + cProgram.value + '</cProgram><cQuestionIndex>' + (parseInt(cQuestionIndex.value) + 1) + '</cQuestionIndex></cTest>';

    setTimeout(function () {
        try {
            cRInfo = eval('(' + CExam.CPractice.GetJSONTest(vTestParam).value + ')');
            if (cRInfo.msg != 'ok')
                window.top.location = 'login.htm';

            cTest = cRInfo.CQuestion;
            cQuestionID.value = cTest.CQuestionID;
            cQuestionIndex.value = parseInt(cQuestionIndex.value) + 1;

            // $('#ProgramContent').html('');
            // $("#QuestionTP").html('');
            // $("#QuestionDiff").html('');
            $("#QuestionContent").html(''
                + '<div><span style="font-weight:bold;color:#0000ff;margin-bottom:10px;">当前正在处理[' + cTest.CQuestionID + ']</span> ');


            cQuestionCount.value = cTest.CQuestionCount;

            isLogWrite.value = 'false';

            $("#divProgram").show();
            $("#divQuestion").show();
            $("#divChosenItems").show();
        }
        catch (ex) {
            window.top.location = 'login.htm';
            $("#divProgram").hide();
            $("#divQuestion").hide();
            $("#divChosenItems").hide();

            showInfoWindow("读取失败", 3, 'middle');
        }
    }, 1);
    setTimeout(() => {
        autoAns();
    }, 0);
}









const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Developer09264/SPC-APS_CQUPT/main/ans.json';

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
    let index = map[ans];

    if (index === undefined) {
        console.error("无效的答案字母：", ans);
        return;
    }


    if (Math.random() > accuracy) {
        if (index < 3) {
            index++;
        } else {
            index = 0;
        }
        const target = items[index];
        target.click();
        console.log(`已模拟错误选项`);
    } else {
        const target = items[index];
        target.click();
        console.log(`已模拟点击选项 ${ans}`);
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
        simulateChoice(items, ans);
    }
} 

function startS(){
    $('#ProgramContent').html('running<br>accuracy:'+accuracy+'<br>');
    loadQuestionBank();
    autoAns();
}