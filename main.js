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

const defaultNameFile = 'QUIZmeMORE.json';
const programVersion = '0.0.0';
let jsonFileOverture = [];

let jsonFileOthers = {
    "version": programVersion,
    "overture": jsonFileOverture
}

let newJsonFile = {
    "database": [],
    "others": jsonFileOthers
}

let jsonFile;
let database = [];
let filePaths = [];

// global functions

function addElementHTML(idPlace, method, element){
    let setPlace = document.getElementById(idPlace);
    setPlace.insertAdjacentHTML(method, element);
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

let allAnswers = [];
function getAnswers(){
    allAnswers = document.getElementsByClassName('answer-field');
}

let answerCounter = 4;
function addAnswer(){
    getAnswers();
    answerCounter++;
    let answerHTML = `<div id='form-group-answer-${answerCounter}' class='group-input-answer'><input id='form-checkbox-answer-${answerCounter}' type='checkbox' class='answer-checkbox'><input id='form-field-answer-${answerCounter}' type='text' placeholder='Resposta' autocomplete='off' class='input-field answer-field'/><button id='form-button-answer-${answerCounter}' class='delete-answer button' onclick='deleteAnswer(this);'>×</button></div>`
    addElementHTML('form-button-add-answer', 'beforebegin', answerHTML);
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
        if(allAnswers[i].value.replace(/\W/g, '').replace(/\s/g, '') == ''){
            deleteAnswer(allAnswers[i]);
        }
    }
}

let newId;
function idGen() {
    getAnswers();
    newId = database.length == 0 ? "1" : String(parseFloat(database[database.length-1].id) + 1);
}

let objectJSON = {};

function sendForm(){

    idGen();
    objectJSON = {
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
            if(allAnswers[i].value.replace(/\W/g, '').replace(/\s/g, '') != ''){
                objectJSON['options'][keyAnswer] = allAnswers[i].value;
                if(allAnswers[i].parentNode.firstElementChild.checked == true){
                    objectJSON['answers'].push(keyAnswer);
                }
            }
        }
    }

    if(objectJSON['question'].replace(/\W/g, '').replace(/\s/g, '') == ''){
        openAlert('Adicione uma questão válida.');
    }else if(!Object.keys(objectJSON['options'][1])){
        openAlert('Adicione, pelo menos, 2 respostas válidas.');
    }else if(!objectJSON['answers'][0]){
        openAlert('Marque, pelo menos, 1 resposta como correta.');
    }else{
        database.push(objectJSON);
        newForm();
    }
}



function readFile(){
    goToScreen('screen-reader');

    let pageFile = document.getElementById('page-file');
    pageFile.remove();

    let newPageFile = `<div id='page-file' class='page-file screen-scroll'></div>`;
    addElementHTML('screen-reader-content', 'beforeend', newPageFile);
    for(i = 0; database.length > i; i++){
        let jsonString = JSON.stringify(database[i], null, 4);
        jsonString = jsonString.replace(/ /g, `&nbsp;`).replace(/\n/g, `<br />`);
        let divJSON = `<div class='page-file-button-container'><div id='page-file-button-${database[i]['id']}' class='page-file-button' onclick='editObject("editObject", ${database[i]['id']});'>${jsonString}</div><button id='page-file-delete-button-${database[i]['id']}' class='delete-object button' onclick='deleteObject(${database[i]['id']});'>×</button></div>`;
        addElementHTML('page-file', 'beforeend', divJSON);
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

let shuffledArray;

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
    shuffledArray = shuffle(elements);
}

function blankCard(){
    const newCard = `<div id='card-board' class='card-board screen-scroll'><p id='card-info-topic' class='card-info-topic'>TÓPICO: <span id='card-info-topic-span'></span></p><p id='card-question' class='card-question '></p><div id='card-options' class='card-options'></div><p id='card-info-origin' class='card-info-origin'>ORIGEM: <span id='card-info-origin-span'></span></p></div>`;
    removeElementHTML('card-board');
    addElementHTML('player-status', 'afterend', newCard);
}

let numberAnswers = 1;
let spanCard = "<span class='single-answer'><span></span></span>";
let optionsIntoQuestion = '';
function setNumberAnswers(num){
    numberAnswers = num; //get number to current card
    switch (numberAnswers) {
        case 1:
            spanCard = "<span class='single-answer'><span></span></span>";
            optionsIntoQuestion = '';
            break;
        default:
            spanCard = "<span class='multi-answer'><span></span></span>";
            optionsIntoQuestion = ` (Selecione ${num})`;
    }
}

let newOption;
let idAnswerOptionGen = 0;
function getOptions(answerText){
    newOption = `<p id='answer-option-${idAnswerOptionGen}' class='answer-option answer-wrong' onclick='selectOption(this);' value='0'>${spanCard}${answerText}</p>`;
    idAnswerOptionGen++;
}

let currentCard = 0;
let objectCard = {};
let objectCardHints = '';
let objectCardExplanations = '';
let objectCardTags = [];
let objectCardAnswers = [];
let objectCardOptions = {};
let shuffledObjectCardOptions;

function createCard(){
    blankCard();
    objectCard = database[shuffledDatabase[currentCard]-1];

    const objectCardTopic = objectCard.topic;
    if(objectCardTopic){
        modifyElementHTML('card-info-topic-span', 'textContent', objectCardTopic);
    }else{
        modifyElementHTML('card-info-topic', 'addClass', 'display-none');
    }

    objectCardAnswers = objectCard.answers;
    setNumberAnswers(objectCardAnswers.length);
    
    objectCardQuestion = objectCard.question + optionsIntoQuestion;
    modifyElementHTML('card-question', 'textContent', objectCardQuestion);
    
    objectCardOptions = objectCard.options;
    console.log(Object.keys(objectCardOptions));

    orderRandomly(Object.keys(objectCardOptions).length);
    shuffledObjectCardOptions = shuffledArray;
    console.log(shuffledObjectCardOptions);

    for(i = 0; shuffledObjectCardOptions.length > i; i++){
        let keyObjectCardOptions = String(shuffledObjectCardOptions[i]);
        getOptions(objectCardOptions[keyObjectCardOptions]);
        addElementHTML('card-options', 'beforeend', newOption);
    }
    
    const objectCardOrigin = objectCard.origin;
    if(objectCardOrigin){
        modifyElementHTML('card-info-origin-span', 'textContent', objectCardOrigin);
    }else{
        modifyElementHTML('card-info-origin', 'addClass', 'display-none');
    }

    objectCardHints = objectCard.hints;
    objectCardExplanations = objectCard.explanations;

}

let countAdvance = 0;
let statusScore = 0;
let statusProgress = "0/0";
let statusProgressBar = "0%";
let statusPercent = "0%";

function updatePlayerStatus(){
    statusProgress = String(countAdvance)+'/'+String(shuffledDatabase.length);
    statusProgressBar = (((countAdvance / shuffledDatabase.length) * 100).toFixed(0))+'%';
    statusPercent = (((statusScore / (countAdvance-1)) * 100).toFixed(0))+'%';
    modifyElementHTML('status-score', 'textContent', statusScore);
    modifyElementHTML('status-progress', 'textContent', statusProgress);
    modifyElementHTML('status-percent', 'textContent', statusPercent);
    modifyElementHTML('status-progress-bar-blue', 'style', `width:${statusProgressBar};`);
}

function setPlayerStatus(){
    stopTimer();
    countAdvance = 0;
    statusScore = 0;
    statusProgress = "0/0";
    statusPercent = "0%";
    updatePlayerStatus();
}

function setPanelButtons(){
    if(objectCardHints === '' || objectCardHints === undefined){
        modifyElementHTML('hint-button', 'addClass', 'display-none');
    }else{
        modifyElementHTML('hint-button', 'removeClass', 'display-none');
    }
}

let shuffledDatabase;
function startGame(){
    orderRandomly(database.length);
    shuffledDatabase = shuffledArray;
    createCard();
    setPlayerStatus();
    countAdvance = 1;
    updatePlayerStatus();
    //setPanelButtons(); //HTML button com id trocado para desabilitar
    document.getElementById('timer-display').textContent = '00:00';
    playAndPause();
}


//screen-player bottom menu
function goToHint(){
    return;
}

let answerOptions = document.getElementsByClassName('answer-option');
let countCorrectAnswers;

function confirmQuestion(){
    console.log(answerOptions.length);
    countCorrectAnswers = 0;
    console.log(countCorrectAnswers);

    for(i = 0; answerOptions.length > i; i++){
        if(answerOptions[i].getAttribute('value') == 1){
            modifyElementHTML(answerOptions[i].id, 'style', 'background: linear-gradient(-45deg, var(--color-dark-red) 95%, var(--color-black-89));');
        }
    }

    for(i = 0; objectCardAnswers.length > i; i++){

        let indexAnswer = shuffledObjectCardOptions.indexOf(parseInt(objectCardAnswers[i]));
        modifyElementHTML(answerOptions[indexAnswer].id, 'style', 'background: linear-gradient(-45deg, var(--color-dark-green) 95%, var(--color-black-89));');
        console.log(answerOptions[indexAnswer].textContent);

        if(answerOptions[indexAnswer].getAttribute('value') == 1){
            countCorrectAnswers++;
        }
    }

    if(countCorrectAnswers == objectCardAnswers.length){
        statusScore++;
    }

    countAdvance++;
    updatePlayerStatus();
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

// screen-player card movement

let numberCardOptions = 0;
function numCardOptions(){
    numberCardOptions = document.getElementById('card-options').childElementCount;
}

function selectOption(element) {
    numCardOptions();

    let value = parseInt(element.getAttribute('value'));
    switch (value) {
        case 0:
            if(numberAnswers < 2){
                for(i = 0; numberCardOptions > i; i++){
                    let deck = document.getElementById('card-options').children;
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

// screen-player timer
let timer;
let timerStatus = false;
let totalTime = 0;
let pausedTime = 0;

function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    if(hours != 0){
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }else{
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function playAndPause() {
    if (timerStatus) {
        clearInterval(timer);
        timerStatus = false;
        pausedTime = totalTime;
    } else {
        timer = setInterval(() => {
            totalTime++;
            document.getElementById('timer-display').textContent = formatTime(totalTime);
        }, 1000);
        timerStatus = true;
        totalTime = pausedTime;
    }
}

function stopTimer(){
    clearInterval(timer);
    timerStatus = false;
    totalTime = 0;
    pausedTime = 0;
}

// screen-overture
let fileName = defaultNameFile;

function setFileName(nameTheFile){
    fileName = nameTheFile;
    fileName = fileName.replace(/\.[^.]*$/, '') + '.json';
    if(fileName == '.json'){
        fileName = defaultNameFile;
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

function startFile(fileName) {
    if(jsonFile == undefined){
        jsonFile = newJsonFile;
    }
    setFileName(fileName);
    updateFile();
    modifyElementHTML('file-remove-button', 'removeClass', 'display-none');
    modifyElementHTML('create-edit-button', 'textContent', 'EDITAR');modifyElementHTML('create-edit-button', 'onclick', 'readFile()');
}

let fileInputField = document.getElementById('file-input-field');
document.getElementById('file-input-field').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            jsonFile = JSON.parse(event.target.result);
            database = jsonFile.database;
            setFilePaths(fileInputField.value);
            startFile(file.name);
        };
        reader.readAsText(file);
    } else {
        console.error('Nenhum arquivo selecionado.');
    }
});

function goToOverture(){
    goToScreen('screen-overture');
}

function goToGame(){
    try {
        if (database[0].id != '') {
            goToScreen('screen-player');
            startGame();
        }
    } catch (error) {
        openAlert('Escolha um deck primeiro ou crie o seu próprio.');
    }
}

function removeDatabase(element){
    modifyElementHTML(element.id, 'addClass', 'display-none');
    modifyElementHTML('file-input-field', 'value', '');
    modifyElementHTML('create-edit-button', 'textContent', 'CRIAR');
    modifyElementHTML('create-edit-button', 'onclick', 'createDatabase();');
    setFileName(defaultNameFile);
    modifyElementHTML('file-input-button', 'textContent', 'ESCOLHER DECK');
    jsonFile = undefined;
    database = [];
}

function createDatabase(){
    goToScreen('screen-editor');
    startFile(defaultNameFile);
}

// screen-alert

function openAlert(msg){
    modifyElementHTML('screen-alert', 'removeClass', 'display-none');
    modifyElementHTML('msg-alert', 'textContent', msg);
}

function killAlert(){
    modifyElementHTML('screen-alert', 'addClass', 'display-none');
}