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

    const cleanedText = extractedText.replace(/^\s*\d{1,2}\)/gm, ' ').replace(/\u3000/g, ' ');
    console.log("extrated, cleaned text:\n", cleanedText);
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

    // const cleanedText = extractedText.replace(/^\s*\d{1,2}\)/gm, ' ').replace(/\u3000/g,' ');

    return extractedText;

}
function buildPrompt(){
    return (getContent() + "\n\n----------\n以上是代码\n----------\n以下是题目\n----------\n\n" + getQuestion() +"\n\n请你解决以上问题");
}