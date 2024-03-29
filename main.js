// LocalStorage
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

// Global variables

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

// Global functions

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

// Global navigation

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

// Screen-overture
let fileName = defaultNameFile;

function setFileName(nameTheFile){
    fileName = nameTheFile;
    fileName = fileName.replace(/\.[^.]*$/, '') + '.json';
    if(fileName == '.json'){
        fileName = defaultNameFile;
    }
    modifyElementHTML('file-input-button-span', 'textContent', fileName);
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
    undoEditId();
}

let fileInputField = document.getElementById('file-input-field');
document.getElementById('file-input-field').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try{
                jsonFile = JSON.parse(event.target.result);
            }catch(error){
                openAlert(1, 'Erro (QMM002): Falha na leitura do arquivo.');
                removeDatabase();
                return;
            }
            database = jsonFile.database;
            if(!database || database == null || database == undefined){
                openAlert(1, 'Erro (QMM003): Este arquivo não possui dados válidos.');
                removeDatabase();
                return;
            }else if(database == ''){                
                openAlert(1, 'Este arquivo está vazio. Mas você pode editá-lo.');
            }
            setFilePaths(fileInputField.value);
            startFile(file.name);
        };
        reader.readAsText(file);
    } else {
        openAlert(1, 'Erro (QMM001): Falha no carregamento do arquivo.');
        removeDatabase();
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
        openAlert(1, 'Escolha um deck primeiro ou crie o seu próprio.');
    }
}

function removeDatabase(){
    modifyElementHTML('file-remove-button', 'addClass', 'display-none');
    modifyElementHTML('file-input-field', 'value', '');
    modifyElementHTML('create-edit-button', 'textContent', 'CRIAR');
    modifyElementHTML('create-edit-button', 'onclick', 'createDatabase();');
    setFileName(defaultNameFile);
    modifyElementHTML('file-input-button-span', 'textContent', 'ESCOLHER DECK');
    jsonFile = undefined;
    database = [];
}

function createDatabase(){
    goToScreen('screen-editor');
    startFile(defaultNameFile);
}

function moreFile(){
    return;
}

// Screen-alert

function openAlert(mode, msg){
    modifyElementHTML('screen-alert', 'removeClass', 'display-none');
    switch(mode){
        case 1:
            modifyElementHTML('screen-alert-model-1', 'removeClass', 'display-none');
            modifyElementHTML('screen-alert-model-2', 'addClass', 'display-none');
            modifyElementHTML('msg-alert-1', 'textContent', msg);
            break;
        case 2:
            case 2:
            modifyElementHTML('screen-alert-model-2', 'removeClass', 'display-none');
            modifyElementHTML('screen-alert-model-1', 'addClass', 'display-none');
            modifyElementHTML('msg-alert-2', 'textContent', msg);
            break;
    }
}

function killAlert(){
    modifyElementHTML('screen-alert', 'addClass', 'display-none');
}

function permitAlert(msg, cmd){
    let message = msg;
    openAlert(2, message);
    let command = cmd;
    modifyElementHTML('permit-alert-button', 'onclick', command);
}

// Screen-editor and Screen-reader

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
        if(allAnswers[i].value.replace(/[\W\s]/g, '') == ''){
            deleteAnswer(allAnswers[i]);
        }
    }
}

function undoEditId(){
    idGen();
    modifyElementHTML('form-button-id', 'textContent', `Id: ${newId}`);
    modifyElementHTML('form-field-id', 'addClass', 'display-none');
    modifyElementHTML('form-button-id', 'removeClass', 'display-none');
}

function editId(){
    let msg = 'Se o campo Id permanecer em branco, será gerado um Id automaticamente. Se alterar o Id para algum já existente, irá sobrescrever e perder o correspondente armazenado. Deseja prosseguir?'
    let cmd = `modifyElementHTML('form-button-id', 'addClass', 'display-none'); modifyElementHTML('form-field-id', 'removeClass', 'display-none'); modifyElementHTML('screen-alert', 'addClass', 'display-none');
    modifyElementHTML('form-button-id', 'textContent', newId);`;
    permitAlert(msg, cmd);
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
            if(allAnswers[i].value.replace(/[\W\s]/g, '') != ''){
                objectJSON['options'][keyAnswer] = allAnswers[i].value;
                if(allAnswers[i].parentNode.firstElementChild.checked == true){
                    objectJSON['answers'].push(keyAnswer);
                }
            }
        }
    }

    for(i = allAnswers.length; i < 4; i++){
        addAnswer();
    }

    if(objectJSON['question'].replace(/[\W\s]/g, '') == ''){
        openAlert(1, 'Adicione uma questão válida.');
    }else if(!Object.keys(objectJSON['options'])[1]){
        openAlert(1, 'Adicione, pelo menos, 2 respostas válidas.');
    }else if(!objectJSON['answers'][0]){
        openAlert(1, 'Marque, pelo menos, 1 resposta como correta.');
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

// Screen-player

let shuffledArray;
let stepNextQuestion = false;

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
    objectCard = database[shuffledDatabase[currentCard]-1]; //bug is happening here about currentCard

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

let shuffledDatabase;
function startGame(){
    orderRandomly(database.length);
    shuffledDatabase = shuffledArray;
    createCard();
    startPlayerStatus();
    currentCard = 1;
    updatePlayerStatus();
    //setPanelButtons(); //HTML button com id trocado para desabilitar
    document.getElementById('timer-display').textContent = '00:00';
    playAndPause();
}

// Screen-player score

let statusScore = 0;
let statusProgress = "0/0";
let statusProgressBar = "0%";
let statusPercent = "0%";

function updatePlayerStatus(){
    statusProgress = String(currentCard)+'/'+String(shuffledDatabase.length);
    statusProgressBar = (((currentCard / shuffledDatabase.length) * 100).toFixed(0))+'%';
    statusPercent = isNaN(((statusScore / (currentCard-1)) * 100).toFixed(0)) ? '0%' : (((statusScore / (currentCard-1)) * 100).toFixed(0)) + '%';
    modifyElementHTML('status-score', 'textContent', statusScore);
    modifyElementHTML('status-progress', 'textContent', statusProgress);
    modifyElementHTML('status-percent', 'textContent', statusPercent);
    modifyElementHTML('status-progress-bar-blue', 'style', `width:${statusProgressBar};`);
}

function startPlayerStatus(){
    stopTimer();
    currentCard = 0;
    statusScore = 0;
    statusProgress = "0/0";
    statusProgressBar = "0%";
    statusPercent = "0%";
    updatePlayerStatus();
}


// Screen-player note board

let finishMsgs = {
    100: 'Você foi perfeito!',
    90: 'Uma mente brilhante!',
    80: 'Você tem talento para a coisa!',
    70: 'Os ventos da boa sorte te guiam!',
    60: 'Você pode melhorar, bote fé!',
    50: 'Ruim não tá, mas bom também não.',
    40: 'A solução é estudar mais.',
    30: 'Assim tá difícil, meu amigo!',
    20: 'É isso o quê você está fazendo da sua vida?',
    10: 'A esperança é a última que morre!',
    0: 'Como é que pode uma coisa dessa?!'
}

function getFinishMsgs() {
    let pickMsg = null;
    for (let i = 0; i < finishMsgs.length; i++) {
        if (finishMsgs[i] <= statusPercent) {
            if (pickMsg === null || array[i] > pickMsg) {
                pickMsg = array[i];
            }
        }
    }
    return finishMsgs[pickMsg];
}

function closeNoteBoard(){
    modifyElementHTML('note-board', 'addClass', 'display-none');
    modifyElementHTML('note-board-status', 'addClass', 'display-none');
    modifyElementHTML('player-status', 'removeClass', 'display-none');
    modifyElementHTML('card-board', 'removeClass', 'display-none');
}

function openNoteBoard(msg){
    modifyElementHTML('player-status', 'addClass', 'display-none');
    modifyElementHTML('card-board', 'addClass', 'display-none');
    modifyElementHTML('note-board', 'removeClass', 'display-none');
    if(msg=='status-game-finished'){
        modifyElementHTML('note-board-status', 'removeClass', 'display-none');
        let newMsg = getFinishMsgs();
        modifyElementHTML('note-board-msg', 'textContent', newMsg);
        modifyElementHTML('note-board-status-score', 'textContent', statusScore);
        modifyElementHTML('note-board-status-total', 'textContent', shuffledDatabase.length);
        modifyElementHTML('note-board-status-percent', 'textContent', statusPercent);
    }else{
        modifyElementHTML('note-board-msg', 'textContent', msg);
    }
}

// Screen-player deck navigation

function setPanelButtons(){
    if(objectCardHints === '' || objectCardHints === undefined){
        modifyElementHTML('hint-button', 'addClass', 'display-none');
    }else{
        modifyElementHTML('hint-button', 'removeClass', 'display-none');
    }
}

function goToHint(){
    return;
}

let answerOptions = document.getElementsByClassName('answer-option');
let countCorrectAnswers;

function validateQuestion(){
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

    updatePlayerStatus();
    modifyElementHTML('confirm-button', 'addClass', 'bright');
    stepNextQuestion = true;
}

function nextQuestion(){
    modifyElementHTML('confirm-button', 'removeClass', 'bright');
    currentCard++;
    updatePlayerStatus();
    console.log(currentCard +', ' + shuffledDatabase.length);
    if(currentCard > shuffledDatabase.length){
        openNoteBoard('status-game-finished');
    }else{
        createCard();
    }
    stepNextQuestion = false;
}

let countMarkedAnswers = 0;
function quantifyMarkedAnswers(){
    countMarkedAnswers = 0;
    for(let i = 0; answerOptions.length > i; i++){
        if(answerOptions[i].getAttribute('value') == 1){
            countMarkedAnswers++;
        }
    }
}

function confirmQuestion(){
    quantifyMarkedAnswers();
    if(countMarkedAnswers == objectCardAnswers.length){
        countMarkedAnswers = 0;
        switch(stepNextQuestion) {
            case false:
                validateQuestion();
                break;
            case true:
                nextQuestion();
                break;
        }
    }else{
        switch(objectCardAnswers.length){
            case 1:
                openAlert(1, 'Você precisa selecionar 1 alternativa para prosseguir.');
                break;
            default:
                openAlert(1, `Você precisa selecionar ${objectCardAnswers.length} alternativas para prosseguir.`);
                break;
        }
    }
    
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

// Screen-player card movements

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

// Screen-player timer

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

// The End