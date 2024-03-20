//LocalStorage
// Salvar uma variável no localStorage
const minhaVariavel = 'Olá, mundo!';
localStorage.setItem('minhaChave', minhaVariavel);

// Obter uma variável do localStorage
const variavelSalva = localStorage.getItem('minhaChave');

console.log(variavelSalva); // Saída: Olá, mundo!


// General variables
let jsonFile;
let database = [];
let filePaths = [];

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
    let answerHTML = `<div class='group-input-answer'><input id='form-checkbox-answer-${answerCounter}' type='checkbox' class='answer-checkbox'><input id='form-field-answer-${answerCounter}' type='text' placeholder='Resposta' class='input-field answer-field'/><button id='form-button-answer-${answerCounter}' class='delete-answer button' onclick='deleteAnswer(this);'>×</button></div>`
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
        let divJSON = `<div class='page-file-button-container'><div id='page-file-button-${database[i]['id']}' class='page-file-button' onclick='editObject("editObject", ${database[i]['id']});'>${jsonString}</div><button id='page-file-delete-button-${database[i]['id']}' class='delete-object button' onclick='deleteObject(${database[i]['id']});'>×</button></div>`;
        addObjectHTML(pageFile, 'beforeend', divJSON);
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

let orderDatabase;

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
let fileInputField = document.getElementById('file-input-field');
const fileInputButton = document.getElementById('file-input-button');
const fileNameEditor = document.getElementById('menu-editor-file-name');
const fileNameReader = document.getElementById('menu-reader-file-name');

function setFileName(nameTheFile){
    fileName = nameTheFile;
    fileName = fileName.replace(/\.[^.]*$/, '') + ".json";

    fileInputButton.innerText = fileName;
    fileNameEditor.innerText = fileName;
    fileNameReader.innerText = fileName;
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

document.getElementById('file-input-field').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            jsonFile = JSON.parse(event.target.result);
            database = jsonFile.database;
            setFileName(file.name);
            setFilePaths(fileInputField.value);
        };
        reader.readAsText(file);
    } else {
        console.error('Nenhum arquivo selecionado.');
    }
});

function goToOverture(){
    goToScreen('screen-overture');
}
function playGame(){
    goToScreen('screen-player');
}