//LocalStorage
function handleLocalStorage(method, key, value){
    switch(method) {
        case 'get':
            localStorage.getItem(key);
            break;
        case 'set':
            localStorage.setItem(key, value);
            break;
        case 'remove':
            localStorage.removeItem(key);
            break;
        case 'clear':
            localStorage.clear();
            break;
        default:
            console.log(localStorage);
    }
}

// General variables

let jsonFile;
let database = [];
let filePaths = [];

// global functions

function addElementHTML(place, method, element){
    let setPlace = place;
    let setMethod = method;
    let setElement = element;
    setPlace.insertAdjacentHTML(setMethod, setElement);
}

function modifyElementHTML(idElement, feature, value){
    switch (feature){
        case 'textContent':
            document.getElementById(idElement).textContent = value;
            break;
        case 'value':
            document.getElementById(idElement).value = value;
            break;
        case 'removeClass':
            document.getElementById(idElement).classList.remove(value);
            break;
        case 'addClass':
            document.getElementById(idElement).classList.add(value);
            break;
        default:
            document.getElementById(idElement).setAttribute(feature, value);
    }
}

function removeElementHTML(idElement){
    document.getElementById(idElement).remove();
}

// navigation

function goToScreen(nextScreen) {
    const appScreens = document.getElementById('main').getElementsByTagName('section');

    let counter;
    for(counter = 0; counter < appScreens.length; counter++) {
        modifyElementHTML(appScreens[counter].id, 'removeClass', 'display-active');
        modifyElementHTML(appScreens[counter].id, 'addClass', 'display-none');
    }
    modifyElementHTML(nextScreen, 'removeClass', 'display-none');
    modifyElementHTML(nextScreen, 'addClass', 'display-active');
}

// screen-editor and screen-reader

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

let answerCounter = 4;
function addAnswer(){
    getAnswers();
    answerCounter++;
    let answerHTML = `<div id='form-group-answer-${answerCounter}' class='group-input-answer'><input id='form-checkbox-answer-${answerCounter}' type='checkbox' class='answer-checkbox'><input id='form-field-answer-${answerCounter}' type='text' placeholder='Resposta' autocomplete='off' class='input-field answer-field'/><button id='form-button-answer-${answerCounter}' class='delete-answer button' onclick='deleteAnswer(this);'>×</button></div>`
    addElementHTML(addAnswerButton, 'beforebegin', answerHTML);
}

function deleteAnswer(element){
    let idFather = document.getElementById(element.id).parentNode.id;
    removeElementHTML(idFather);
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
    getAnswers();
    newId = database.length == 0 ? "1" : String(parseFloat(database[database.length-1].id) + 1);
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
        "explanations": explanationField.textContent,
        "tags": []
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

    pageFile.remove();
    let setPlace = document.getElementById('screen-reader-content');
    let newPageFile = `<div id='page-file' class='page-file screen-scroll'></div>`;
    addElementHTML(setPlace, 'beforeend', newPageFile);
    pageFile = document.getElementById('page-file');
    for(i = 0; database.length > i; i++){
        let jsonString = JSON.stringify(database[i], null, 4);
        jsonString = jsonString.replace(/ /g, `&nbsp;`).replace(/\n/g, `<br />`);
        let divJSON = `<div class='page-file-button-container'><div id='page-file-button-${database[i]['id']}' class='page-file-button' onclick='editObject("editObject", ${database[i]['id']});'>${jsonString}</div><button id='page-file-delete-button-${database[i]['id']}' class='delete-object button' onclick='deleteObject(${database[i]['id']});'>×</button></div>`;
        addElementHTML(pageFile, 'beforeend', divJSON);
    }
}

function verificateFile() {

}

function updateFile() {
    jsonFile.database = database;
}

function saveFile(){
    updateFile();
    let jsonObject = JSON.stringify(jsonFile, null, 2);
    let blob = new Blob([jsonObject], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/*
function createAndCopyJSONToClipboard(object) {
    const jsonString = JSON.stringify(object, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], fileName);

    const reader = new FileReader();
    reader.onload = function(event) {
        navigator.clipboard.writeText(event.target.result)
            .then(() => {
                console.log('Arquivo JSON copiado para a área de transferência. Cole-o no WhatsApp.');
            })
            .catch(err => {
                console.error('Erro ao copiar arquivo JSON para a área de transferência:', err);
                console.log('Erro ao copiar arquivo JSON para a área de transferência. Por favor, copie manualmente.');
            });
    };
    reader.readAsText(file);
}

function openWhatsApp() {
    const whatsappUrl = 'https://web.whatsapp.com/';
    window.open(whatsappUrl, '_blank');
}

function shareFile(){
    updateFile();
    createAndCopyJSONToClipboard(jsonFile);
    openWhatsApp();
}
*/

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

let shuffledDatabase;

function orderRandomly(quantity) {
    let elements = [];
    for (let i = 1; i <= quantity; i++) {
        elements.push(i);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    return shuffle(elements);
}

function getCards(){
    let reorderedElements;
    if(database){
        reorderedElements = orderRandomly(10);
    }else{
        reorderedElements = orderRandomly(10);
        console.log("ainda não tem cards");
    }
    reorderedElements = orderRandomly(10);
}

let numberOptions = 1;
let spanCard = "<span class='single-answer'></span>";
function numOptions(){
    numberOptions = 1;
    switch (numberOptions) {
        case 1:
            spanCard = "<span class='single-answer'></span>";
            break;
        default:
            spanCard = "<span class='multi-answer'></span>";
    }   
}

function playAndPause(){
    return;
}

let numberCards = 0;
function numCards(){
    numberCards = document.getElementById('answers-deck').childElementCount;
}

function pickCard(element) {
    numOptions();
    numCards();

    let value = parseInt(element.getAttribute('value'));
    switch (value) {
        case 0:
            if(numberOptions < 2){
                for(i = 0; numberCards > i; i++){
                    let deck = document.getElementById('answers-deck').children;
                    deck[i].setAttribute('value', '0');
                }
            }
            element.setAttribute('value', '1');
            break;
        case 1:
            element.setAttribute('value', '0');
            break;
    }
}

function goToHint(){
    return;
}

function confirmQuestion(){
    return;
}

function goToExplanation(){
    return;
}

function goToCardFirst(){
    return;
}
function goToCardBefore(){
    return;
}
function moveCardToLast(){
    return;
}
function goToCardNext(){
    return;
}
function goToCardLast(){
    return;
}

// screen-overture

let fileName = 'QUIZmeMORE.json';

function setFileName(nameTheFile){
    fileName = nameTheFile;
    fileName = fileName.replace(/\.[^.]*$/, '') + '.json';
    if(fileName == '.json'){
        fileName = 'QUIZmeMORE.json';
    }
    modifyElementHTML('file-input-button', 'textContent', fileName);
    modifyElementHTML('menu-editor-file-name', 'textContent', fileName);
    modifyElementHTML('menu-reader-file-name', 'textContent', fileName);
}

const maxPaths = 10;
function setFilePaths(newPath){
    if(filePaths.length > maxPaths - 1){
        filePaths.shift();
    }
    if(filePaths.length < maxPaths){
        filePaths.push(newPath);
    }
}

let fileInputField = document.getElementById('file-input-field');
document.getElementById('file-input-field').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            jsonFile = JSON.parse(event.target.result);
            database = jsonFile.database;
            setFileName(file.name);
            setFilePaths(fileInputField.value);
            modifyElementHTML('file-remove-button', 'removeClass', 'display-none');
            modifyElementHTML('create-edit-button', 'textContent', 'EDITAR');modifyElementHTML('create-edit-button', 'onclick', 'readFile()');
        };
        reader.readAsText(file);
    } else {
        console.error('Nenhum arquivo selecionado.');
    }
});

function goToOverture(){
    goToScreen('screen-overture');
}

function loadDatabase(){
    return;
}

function playGame(){
    try {
        if (database[0].id != '') {
            console.log('existe arquivo');
            goToScreen('screen-player');
            loadDatabase();
        }
    } catch (error) {
        console.log("Deck não selecionado ou arquivo não compatível.");
    }
}

function removeDatabase(element){
    modifyElementHTML(element.id, 'addClass', 'display-none');
    modifyElementHTML('file-input-field', 'value', '');
    modifyElementHTML('create-edit-button', 'textContent', 'CRIAR');
    modifyElementHTML('create-edit-button', 'onclick', 'createDatabase();');
    setFileName('QUIZmeMORE.json');
    modifyElementHTML('file-input-button', 'textContent', 'ESCOLHER DECK');
    jsonFile = undefined;
    database = [];
}

function createDatabase(){
    goToScreen('screen-editor');
}