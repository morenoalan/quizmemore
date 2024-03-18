//LocalStorage

let database = [
    {
        "id": "0",
        "origin": "default",
        "topic": "0",
        "question": "What is this?",
        "options": {
            "1": "a bird",
            "2": "an instrument",
            "3": "a game",
            "4": "a person"
        },
        "answers": ["3"],
        "hints": "it's not boring.",
        "explanations": "the correct option is \"a game\" because although you can study by here, this is a gamified tool and you always can use to spend free time and make fun with friends."
    }
];


// navigation

function goToScreen(nextScreen) {
    const appScreens = document.getElementById('main').getElementsByTagName('section');

    const openScreen = document.getElementById(nextScreen);
    let counter;
    for(counter = 0; counter < appScreens.length; counter++) {
        appScreens[counter].classList.remove('display-active');
        appScreens[counter].classList.add('display-none');
    }
    openScreen.classList.remove('display-none');
    openScreen.classList.add('display-active');
}

// screen-editor

const originField = document.getElementById('form-field-origin');
const topicField = document.getElementById('form-field-topic');
const questionField = document.getElementById('form-field-question');
const hintField = document.getElementById('form-field-hint');
const explanationField = document.getElementById('form-field-explanation');
const addAnswerButton = document.getElementById('form-button-add-answer');

let allAnswers = [];
function getAnswers(){
    allAnswers = document.getElementsByClassName('answer-field');
}

function addObjectHTML(place, method, object){
    let setPlace = place;
    let setMethod = method;
    let setObject = object;
    setPlace.insertAdjacentHTML(setMethod, setObject);
}

let answerCounter = 4;
function addAnswer(){
    getAnswers();
    answerCounter++;
    let answerHTML = `<div class='group-input-answer'><input id='form-checkbox-answer-${answerCounter}' type='checkbox' class='answer-checkbox'><input id='form-field-answer-${answerCounter}' type='text' placeholder='Resposta' class='input-field answer-field'/><button id='form-button-answer-${answerCounter}' class='delete-answer' onclick='deleteAnswer(this);'>×</button></div>`
    addObjectHTML(addAnswerButton, 'beforebegin', answerHTML);
}

function deleteAnswer(element){
    document.getElementById(element.id).parentNode.remove();
}

function newForm(){
    originField.value = '';
    topicField.value = '';
    questionField.textContent = '';
    hintField.textContent = '';
    explanationField.textContent = '';
    getAnswers();
    for(i = allAnswers.length-1; i >= 0; i--){
        deleteAnswer(allAnswers[i]);
        /*
        allAnswers[i].value = '';
        allAnswers[i].parentNode.firstElementChild.checked = false;
        */
    }
    for(i = 0; i < 4; i++){
        addAnswer();
    }
}

function deleteEmptyAnswers(){
    getAnswers();
    for(i = allAnswers.length-1; i >= 0; i--){
        if(allAnswers[i].value == ''){
            deleteAnswer(allAnswers[i]);
        }
    }
}

let newId;
function idGen() {
    newId = String(parseFloat(database[database.length-1].id) + 1);
}

function sendForm(){
    idGen();
    let objectJSON = {
        "id": newId,
        "origin": originField.value,
        "topic": topicField.value,
        "question": questionField.textContent,
        "options": {},
        "answers": [],
        "hints": hintField.textContent,
        "explanations": explanationField.textContent
    }
    deleteEmptyAnswers();
    getAnswers();
    for(i = 0; allAnswers.length > i; i++){
        if(allAnswers[i].value){
            let j = i + 1;
            let keyAnswer = `${j}`;
            objectJSON["options"][keyAnswer] = allAnswers[i].value;
            if(allAnswers[i].parentNode.firstElementChild.checked == true){
                objectJSON["answers"].push(keyAnswer);
            }
        }
    }
    database.push(objectJSON);
    newForm();
}

let pageFile = document.getElementById('page-file');

function readFile(){
    goToScreen('screen-reader');
    /*
    let jsonString = JSON.stringify(database, null, 4);
    jsonString = jsonString.replace(/ /g, `&nbsp;`).replace(/\n/g, `<br />`);
    pageFile.innerHTML = jsonString;
    */
    pageFile.remove();
    let setPlace = document.getElementById('screen-reader-content');
    let newPageFile = `<div id='page-file' class='page-file screen-scroll'></div>`;
    addObjectHTML(setPlace, 'beforeend', newPageFile);
    pageFile = document.getElementById('page-file');
    for(i = 0; database.length > i; i++){
        let jsonString = JSON.stringify(database[i], null, 4);
        jsonString = jsonString.replace(/ /g, `&nbsp;`).replace(/\n/g, `<br />`);
        let divJSON = `<div><div id='page-file-button-${database[i]['id']}' class='page-file-button' onclick='editObject("editObject", ${database[i]['id']});'>${jsonString}</div><button id='page-file-delete-button-${database[i]['id']}' class='delete-object' onclick='deleteObject(${database[i]['id']});'>×</button></div>`;
        addObjectHTML(pageFile, 'beforeend', divJSON);
    }
}

function saveFile(){
    return;
}

function shareFile(){
    return;
}

function deleteObject(idObject){
    database = database.filter((object) => object.id !== String(idObject));
    readFile();
}

function editObject(method, idObject){
    switch (method) {
        case 'editObject':
            goToScreen('screen-editor');
            newForm();
            deleteEmptyAnswers();
            let objectSelected = database.find((elem) => elem.id === String(idObject));

            originField.value = objectSelected["origin"];
            topicField.value = objectSelected["topic"];
            questionField.textContent = objectSelected["question"];
            hintField.textContent = objectSelected["hints"];
            explanationField.textContent = objectSelected["explanations"];
            for(i = 0; Object.keys(objectSelected["options"]).length > i; i++){
                addAnswer();
                document.getElementsByClassName('answer-field')[i].value = objectSelected["options"][i+1];
            }
            getAnswers();
            for(i = 0; Object.keys(objectSelected["answers"]).length > i; i++){
                allAnswers[objectSelected["answers"][i]-1].parentNode.firstElementChild.checked = true;
            }
            break;
        default:
            goToScreen('screen-editor');
            break;
    }
}

//screen-player
function goToHint(){
    return;
}

function goToExplanation(){
    return;
}

function goToCardLeft(){
    return;
}

function goToCardRight(){
    return;
}