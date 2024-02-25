document.addEventListener('DOMContentLoaded',()=>{
    const menuDiv=document.querySelector('#menu');
    const creatorDiv=document.querySelector('#creator');
    const playerDiv=document.querySelector('#player');

    menuDiv.style.display="none";
    
    const creatorGrid=document.querySelector('#creator-grid');
    const toolbar=document.querySelector('#toolbar');
    const selectedText=document.querySelector('#selected-text');
    const editor=document.querySelector('#editor');
    const confirmEditButton=document.querySelector('#confirm-edit');
    const cancelEditButton=document.querySelector('#cancel-edit');
    const editOutput=document.querySelector('#edit-output');
    const directionButtons=document.querySelector('#direction-buttons');
    const colorButtons=document.querySelector('#color-buttons');
    const playButton=document.querySelector('#play');
    const clearButton=document.querySelector('#clear');
    const otherButtons=document.querySelector('#other-buttons');
    const unplayButton=document.querySelector('#unplay');
    const startButton=document.querySelector('#start-button');
    const pauseButton=document.querySelector('#pause-button');
    const eraseButton=document.querySelector('#erase');
    const eraseAllButton=document.querySelector('#eraseall');
    const undoButton=document.querySelector('#undo');
    const erasingStatus=document.querySelector('#erasing')
    const controls=document.querySelector('#controls');
    const playerGrid=document.querySelector('#player-grid');
    const layer1=document.querySelector('#layer1');
    const layer2=document.querySelector('#layer2');
    const layer3=document.querySelector('#layer3');
    const topLayer=document.querySelector('#topLayer');
    const layersDiv=document.querySelector('#layers');
    const loadALevelDiv=document.querySelector('#load-a-level');
    const trackCounter=document.querySelector('#track-count');
    const journeyCounter=document.querySelector('#journey-count');
    const winTrackCounter=document.querySelector('#win-track-count');
    const winJourneyCounter=document.querySelector('#win-journey');
    const speedSlider=document.querySelector('#speed-slider');
    const trainStatus=document.querySelector('#status');
    const toCreatorButton=document.querySelector('#create');
    const toMenuButton=document.querySelector('#to-menu-button');
    const levelCodeInput=document.querySelector('#level-code-input');
    const loadLevelButton=document.querySelector('#load-level-button');
    const getLevelCodeButton=document.querySelector('#get-level-code-button');
    const copiedStatus=document.querySelector('#copied');
    const winDiv=document.querySelector('#win-div');
    const winDivHolder=document.querySelector('#win-div-holder');
    const screenshotDiv=document.querySelector('#screenshot');
    const replayLevelButton=document.querySelector('#replayLevelButton');
    const editLevelButton=document.querySelector('#editLevelButton');
    const shareSolutionButton=document.querySelector('#shareSolutionButton');
    const backToMenuButton=document.querySelector('#backToMenu');
    const canvasHolder=document.querySelector('#canvas-holder');
    const canvasHolderDiv=document.querySelector('#canvas-holder-holder');
    const backToLevelButton=document.querySelector('#back-to-level');
    const toMenuAgainButton=document.querySelector('#to-menu-again');
    const starsDisplay=document.querySelector('#stars');
    const levelButtons=document.querySelector('#levelButtons');
    const resetStatsButton=document.querySelector('#reset-stats');
    const changeBackgroundColor=document.querySelector('#change-background-color');
    const resetBackgroundButton=document.querySelector('#reset-colors');

    winDivHolder.style.display="none";
    playerDiv.style.display="none";
    editor.style.display="none";
    controls.style.display="none";
    canvasHolderDiv.style.display="none";


    const boardSize=7;
    const boxSize=60;

    winDivHolder.style.width=winDivHolder.style.height=screenshotDiv.style.width=screenshotDiv.style.height=boxSize*boardSize+'px';

    if(window.localStorage.getItem('hasPlayed')!=='true'){
        let s=window.localStorage;
        console.log('Have fun!');
        s.setItem('hasPlayed',true);
        s.setItem('stars',0);
        s.setItem('background','white');
        Array.from(levelButtons.childNodes).forEach(element=>{
            if(element.tagName==="BUTTON"){
                s.setItem('beat'+element.id,false);
            }
        })
    } 
    
    Array.from(changeBackgroundColor.childNodes).forEach(element=>{
        if(element.tagName==="INPUT"){
            element.maxLength=3;
            element.onkeydown=(e)=>{
                if(parseInt(e.key)>-1||e.key==='Backspace'){
                    setTimeout(()=>{
                        window.localStorage.setItem(element.id,element.value);
                        updateBackground();
                    })
                    return e.key;
                }
                else{
                    return false;
                }
            }
            element.onchange=(e)=>{
                if(element.value>255){
                    element.value=255;
                }
                updateBackground();
            }
        }
    })

    resetBackgroundButton.addEventListener('click',()=>{
        [$('#r1'),$('#g1'),$('#b1'),$('#r2'),$('#g2'),$('#b2')].forEach((element=>{
            element.val(255);
            window.localStorage.setItem(element.attr('id'),element.val())
        }))
        updateBackground();
    })

    function updateBackground(){
        [$('#r1'),$('#g1'),$('#b1'),$('#r2'),$('#g2'),$('#b2')].forEach((element=>{
            element.val(window.localStorage.getItem(element.attr('id')));
         }))
        document.body.style.background='linear-gradient(90deg, rgb('+$('#r1').val()+','+$('#g1').val()+','+$('#b1').val()+') 0%, rgb('+$('#r2').val()+','+$('#g2').val()+','+$('#b2').val()+') 100%)';
        window.localStorage.setItem('background',document.body.style.background);
    }
    updateBackground();

    Array.from(levelButtons.childNodes).forEach(element=>{
        if(element.tagName==="BUTTON"){
            let id=copy(element.id);
            element.addEventListener('click',()=>{
                loadLevel(getLevelCode(eval('challenges.'+id+'.level')),true)
                challengeStars=eval('challenges.'+id+'.stars');
                currentChallenge=id;
                resetPlayer();
            })
            element.insertAdjacentHTML('beforeend','<span></span>');
            element.insertAdjacentHTML('afterend','<br>');
        }
    })

    var mouseDown=false;
    document.addEventListener("mousedown",()=>{mouseDown=true;});
    document.addEventListener("mouseup",()=>{mouseDown=false;});

    confirmEditButton.addEventListener('click',confirmEditing);
    cancelEditButton.addEventListener('click',cancelEditing);

    resetStatsButton.addEventListener('click',()=>{
        if(confirm('Do you really want to reset your stats?')){
            window.localStorage.setItem('hasPlayed',false);
            window.location.reload();
        }
    })

    replayLevelButton.addEventListener('click',()=>{
        winDivHolder.style.display="none";
        won=false;
        running=true;
        backToTheDrawingBoard();
    })

    editLevelButton.addEventListener('click',()=>{
        replayLevelButton.click();
        stopLevel();
    })

    shareSolutionButton.addEventListener('click',()=>{
        canvasHolderDiv.style.display='';
        controls.style.display='none';
        screenshotDiv.style.display='none';
    })

    backToLevelButton.addEventListener('click',()=>{
        canvasHolderDiv.style.display='none';
        controls.style.display='';
        screenshotDiv.style.display='';
    })

    backToMenuButton.addEventListener('click',()=>{
        replayLevelButton.click();
        challenge=false;
        eraseAllButton.click();
        stopLevel();
        resetCreator();
        toMenuButton.click();
    })

    toMenuAgainButton.addEventListener('click',()=>{
        backToMenuButton.click();
    })

    getLevelCodeButton.addEventListener('click',()=>{
        navigator.clipboard.writeText(getLevelCode(copy(level)));
        copiedStatus.style.display="";
    })

    loadLevelButton.addEventListener('click',()=>{
        loadLevel(levelCodeInput.value,false);
        levelCodeInput.value="";
    })

    toCreatorButton.addEventListener('click',()=>{
        creatorDiv.style.display='';
        menuDiv.style.display='none';
    })

    toMenuButton.addEventListener('click',()=>{
        starsDisplay.innerHTML=window.localStorage.getItem('stars');
        Array.from(levelButtons.childNodes).forEach(element=>{
            if(element.tagName==="BUTTON"){
                let span=element.lastChild;
                try{
                span.innerHTML=' ('+eval('challenges.'+element.id+'.stars')+' stars) '+((window.localStorage.getItem('beat'+element.id)==='true')?'✓':'');
                }catch{}
            }
        })
        creatorDiv.style.display='none';
        menuDiv.style.display='';
        copiedStatus.style.display='none';
        setTimeout(()=>{scrollTo(0,0)})
    })
    toMenuButton.click();

    playButton.addEventListener('click',()=>{
        if(!editing){playLevel();copiedStatus.style.display='none'}
    })

    unplayButton.addEventListener('click',()=>{
        if(!won){
            stopLevel();
        }
    })

    directionButtons.childNodes.forEach((button)=>{
        button.addEventListener('click',()=>{arrowButtonClick(button.id)})
    })

    colorButtons.childNodes.forEach((button)=>{
        button.addEventListener('click',()=>{colorButtonClick(button.id)})
    })

    toolbar.childNodes.forEach(button=>{
        button.addEventListener('click',()=>{selectObject(button.id)})
    })

    clearButton.addEventListener('click',()=>{
        if(!editing){resetCreator()}
    })

    eraseButton.addEventListener('click',()=>{
        if(running||won){return false;}
        erasing=erasing?false:true;
        erasingStatus.innerHTML="Erasing: "+(erasing?"erasing":"not erasing");
    })

    eraseAllButton.addEventListener('click',()=>{
        if(running||won){return false;}
        trackHistory.unshift(copy(level));
        resetPlayer();
    })
    
    undoButton.addEventListener('click',()=>{
        if(running||won){return false;}
        undo();
    })

    speedSlider.addEventListener('input',()=>{
        speed=speedSlider.value;
    })
    
    startButton.addEventListener('click',()=>{
        if(!running&&!won){
            startTheTrains();
        }
    })

    pauseButton.addEventListener('click',()=>{
        if(running){
            backToTheDrawingBoard();
        } 
    })

    var level=null;

    var objectSelected=null;
    var squareSelected=null;

    var editing=false;
    var playing=false;
    var erasing=false;
    var running=false;
    var challenge=false;

    function setupCreator(){
        for(let i=0;i<boardSize;i++){
            let row=document.createElement('tr');
            for(let j=0;j<boardSize;j++){
                let cell=document.createElement('td');
                cell.classList.add('cell');
                cell.addEventListener('mouseover',(e)=>{selectSquare(e.target)})
                cell.addEventListener('mousedown',(e)=>{mouseDown=true;selectSquare(e.target)})
                row.append(cell);
            }
            creatorGrid.append(row);
        }
    }
    setupCreator();

    function setupPlayer(){
        for(let i=0;i<boardSize;i++){
            let row=document.createElement('tr');
            for(let j=0;j<boardSize;j++){
                let cell=document.createElement('td');
                cell.classList.add('cell');
                cell.addEventListener('mouseover',(e)=>{selectSquare(e.target);startTrack(e.target)})
                cell.addEventListener('mousedown',(e)=>{mouseDown=true;selectSquare(e.target);startTrack(e.target,[i,j])});
                cell.addEventListener('dblclick',(e)=>{if(!running){switchTrack(e.target,[i,j])}});
                cell.addEventListener('mouseup',(e)=>{endTrack()});
                row.append(cell);
            }
            playerGrid.append(row);
        }
    }
    setupPlayer();

    function setupLayers(){
        for(let i=0;i<boardSize;i++){
            let row=document.createElement('tr');
            for(let j=0;j<boardSize;j++){
                let cell=document.createElement('td');
                cell.classList.add('no-border')
                row.append(cell);
            }
            let row2=row.cloneNode(true);
            let row3=row.cloneNode(true);
            let row4=row.cloneNode(true);
            layer1.append(row);
            layer2.append(row2);
            layer3.append(row3);
            topLayer.append(row4);
        }
    }
    setupLayers();

    function setupLevelArray(){
        level=[];
        for(let i=0;i<boardSize;i++){
            level.push([]);
            for(let j=0;j<boardSize;j++){
                    level[i].push({
                    type:"empty",
                    colors:[],
                    colorsCopy:[],
                    directions:[],
                    directionsCopy:[],
                    tracks:[],
                    tracksCopy:[],
                    swappable:true,
                    endFilled:false,
                    position:[i,j],
                    creatorCell:creatorGrid.childNodes[i].childNodes[j],
                    playerCell:playerGrid.childNodes[i].childNodes[j],
                    layer1Cell:layer1.childNodes[i].childNodes[j],
                    layer2Cell:layer2.childNodes[i].childNodes[j],
                    layer3Cell:layer3.childNodes[i].childNodes[j],
                    topLayerCell:topLayer.childNodes[i].childNodes[j],
                    selected:false,
                    left:[boxSize*j,boxSize*i+boxSize/2],
                    right:[boxSize*(j+1),boxSize*i+boxSize/2],
                    up:[boxSize*j+boxSize/2,boxSize*i],
                    down:[boxSize*j+boxSize/2,boxSize*(i+1)],
                    leftup:[boxSize*j+Math.sqrt(2)*boxSize/4,boxSize*i+Math.sqrt(2)*boxSize/4],
                    leftdown:[boxSize*j+Math.sqrt(2)*boxSize/4,boxSize*(i+1)-Math.sqrt(2)*boxSize/4],
                    upright:[boxSize*(j+1)-Math.sqrt(2)*boxSize/4,boxSize*i+Math.sqrt(2)*boxSize/4],
                    downright:[boxSize*(j+1)-Math.sqrt(2)*boxSize/4,boxSize*(i+1)-Math.sqrt(2)*boxSize/4],
                    center:[boxSize*(j+0.5),boxSize*(i+0.5)],
                }); 
            }
        }
        squareSelected=level[0][0];
        objectSelected=null;
    }
    setupLevelArray();

    function resetCreator(){
        let i=0;
        let j=0;
        creatorGrid.childNodes.forEach(row=>{
            row.childNodes.forEach(cell=>{
                var square=level[i][j];
                cell.innerHTML="";
                square.directions=[];
                square.colors=[];
                square.tracks=[];
                square.type="empty";
                square.playerCell.innerHTML="";
                j++;
            })
            j=0;
            i++;
        });
        updateLayers();
    }

    function resetPlayer(){
        let i=0;
        let j=0;
        playerGrid.childNodes.forEach(row=>{
            row.childNodes.forEach(cell=>{
                var square=level[i][j];
                if(square.tracks.length>0&&square.type==="empty"){
                    cell.innerHTML="";
                    square.tracks=[];
                }
                j++;
            })
            j=0;
            i++;
        })
        updateLayers();
    }

    const btoaamount=0;
    function getLevelCode(lvl){
        let code=[];
        for(let i=0;i<lvl.length;i++){
            code.push([]);
            for(let j=0;j<lvl[i].length;j++){
                code[i].push({});
                code[i][j].t=lvl[i][j].t||lvl[i][j].type;
                code[i][j].d=lvl[i][j].d||lvl[i][j].directions;
                code[i][j].c=lvl[i][j].c||lvl[i][j].colors;
            }
        }
        code=JSON.stringify(code);
        for(let i=0;i<btoaamount;i++){
            code=btoa(code);
        }
        return code;
    }

    function loadLevel(code,chal){
        try{
        for(let i=0;i<btoaamount;i++){
            code=atob(code);
        }
        let lvl=JSON.parse(code);
        for(let i=0;i<boardSize;i++){
            for(let j=0;j<boardSize;j++){
                level[i][j].type=lvl[i][j].t;
                level[i][j].directions=lvl[i][j].d;
                level[i][j].colors=lvl[i][j].c;
            }
        }
        updateLayers();
        }catch(e){
            alert("An error occured. Make sure your code is correct")
        }
        if(chal){
            challenge=true;
            toCreatorButton.click();
            playButton.click();
        }
    }

    var challengeStars=0;
    var currentChallenge='';
    //var challenges
    function selectSquare(cell){
        if(editing||!mouseDown){
            return false;
        }
        for(let i=0;i<creatorGrid.childNodes.length;i++){
            if(cell.parentNode.parentNode.childNodes[i]===cell.parentNode){
                //i finally know what this does!
                const previousSelected=copy(squareSelected);
                squareSelected.selected=false;
                squareSelected=level[i][cell.cellIndex];
                if(!playing){
                    squareSelected.selected=true;
                }
                

                if(objectSelected===null){
                    
                }
                else if(objectSelected==="edit"){
                    edit(cell);
                }
                else if(objectSelected==="delete"){
                    cell.innerHTML="";
                    squareSelected.type="empty";
                    squareSelected.colors=[];
                    squareSelected.directions=[];
                    squareSelected.tracks=[];
                }
                else{
                    cell.classList.add(objectSelected);
                    //cell.innerHTML=objectSelected;
                    squareSelected.type=objectSelected;
                    if(previousSelected.type===squareSelected.type){
                        squareSelected.colors=previousSelected.colors;
                        squareSelected.directions=previousSelected.directions;
                    }
                    else{
                        squareSelected.colors=[];
                        squareSelected.directions=[];
                        squareSelected.tracks=[];
                    
                        if(objectSelected==="rock"){

                        }
                        else if(objectSelected==="scissors"){
                            squareSelected.directions.push("up");
                        }
                        else if(objectSelected==="paint"){
                            squareSelected.directions.push("up","down");
                            squareSelected.colors.push("red");
                        }
                        else {
                            squareSelected.directions.push("up");
                            squareSelected.colors.push("red");
                        }
                    }
                }
            }
        }
        updateLayers();
    }

    function selectObject(object){
        if(editing){
            return false;
        }
        objectSelected=objectSelected===object?null:object;
        selectedText.innerHTML="Selected: "+(objectSelected || "none");
    }


    function edit(cell){
        displayEditOutput();
        if(squareSelected.type==="empty"||squareSelected.type==="rock"){
            return false;
        }
        editor.style.display="block";
        squareSelected.colorsCopy=copy(squareSelected.colors);
        squareSelected.directionsCopy=copy(squareSelected.directions);
        squareSelected.tracksCopy=copy(squareSelected.tracks);
        editing=true;
    }

    function arrowButtonClick(button){
        if(squareSelected.type==="start"||squareSelected.type==="scissors"){
            squareSelected.directions=[];
            squareSelected.directions.push(button);
        }
        if(squareSelected.type==="end"){
            if(squareSelected.directions.includes(button)){
                if(squareSelected.directions.length>0){
                    squareSelected.directions.splice(squareSelected.directions.indexOf(button),1);
                }
            }
            else{
                squareSelected.directions.push(button);
            }
        }
        if(squareSelected.type==="paint"){
            if(!squareSelected.directions.includes(button)){
                squareSelected.directions[1]=squareSelected.directions[0];
                squareSelected.directions[0]=button;
            }
        }
        displayEditOutput();
    }

    function colorButtonClick(button){
        if(squareSelected.type==="start"||squareSelected.type==="end"){
            if(squareSelected.colors.length>0&&button==="backspace"){
                squareSelected.colors.pop();
            }
            else if(squareSelected.colors.length<9){
                if(button!=="backspace"){
                   squareSelected.colors.push(button); 
                }
            }
        }
        if(squareSelected.type==="scissors"){
            
        }
        if(squareSelected.type==="paint"){
            if(button!=='backspace'){
                squareSelected.colors=[];
                squareSelected.colors.push(button);
            }
        }
        displayEditOutput();
    }

    function displayEditOutput(){
        const keys={up:'Up',down:'Down',left:'Left',right:'Right',red:'R',orange:'O',yellow:'Y',green:'G',blue:'B',purple:'P',brown:'T'}
        let directions=squareSelected.directions.map(direction=>eval('keys.'+direction)).join('');
        let colors=squareSelected.colors.map(color=>eval('keys.'+color)).join('');
        editOutput.value=squareSelected.type+directions+colors;
    }
    
    function confirmEditing(){
        editing=false;
        editor.style.display="none";
        if(!squareSelected.colors.length){
            squareSelected.colors=copy(squareSelected.colorsCopy);
        }
        if(!squareSelected.directions.length){
            squareSelected.directions=copy(squareSelected.directionsCopy);
        }
        squareSelected.colorsCopy=[];
        squareSelected.directionsCopy=[];
        squareSelected.tracksCopy=[];
        displayEditOutput();
        //document.querySelector('.selected').innerHTML=editOutput.value;
        updateLayers();
    }

    function cancelEditing(){
        editing=false;
        editor.style.display="none";
        squareSelected.colors=copy(squareSelected.colorsCopy);
        squareSelected.directions=copy(squareSelected.directionsCopy);
        squareSelected.tracks=copy(squareSelected.tracksCopy);
        squareSelected.colorsCopy=[];
        squareSelected.directionsCopy=[];
        squareSelected.tracksCopy=[];
    }

    function playLevel(){
        if(challenge){
            unplayButton.style.display="none";
            toMenuAgainButton.style.display='';
        }
        else{
            unplayButton.style.display="";
            toMenuAgainButton.style.display='none';
        }
        var i=0;
        var j=0;
        playerGrid.childNodes.forEach(row=>{
            row.childNodes.forEach(cell=>{
                cell.innerHTML=level[i][j].creatorCell.innerHTML;
                //lol
                if(level[i][j].type!=="empty"){
                    level[i][j].tracks=[];
                }
                j++;
            })
            j=0;
            i++;
        })
        playing=true;
        toolbar.style.display="none";
        otherButtons.style.display="none";
        loadALevelDiv.style.display="none";
        creatorGrid.style.display="none";
        controls.style.display="";
        playerDiv.style.display="";
        selectObject(null);
        squareSelected.selected=false;
        updateLayers();
    }

    function stopLevel(){
        playing=false;
        backToTheDrawingBoard();
        if(erasing){
            eraseButton.click();
        }
        toolbar.style.display="";
        otherButtons.style.display="";
        loadALevelDiv.style.display="";
        creatorGrid.style.display="";
        unplayButton.style.display="none";
        controls.style.display="none";
        playerDiv.style.display="none";
        //resetPlayer();
        updateLayers();
    }
    
    var tracks=[];
    var previousTracks=[];
    var trackHistory=[];

    function startTrack(cell,position){
        if(!mouseDown||running||won){
            return false;
        }
        if(tracks.length===0){
            previousTracks=copy(level);
        }
        tracks.unshift(squareSelected);
        if(erasing&&squareSelected.type==="empty"){
            squareSelected.tracks=[];
            tracks=[];
            updateLayers();
            return false;
        }
        if(tracks.length<3){
            return false;
        }
        if(tracks[1].type!=="empty"){
            return false;
        }
        tracks.splice(3);
        let correspondingLevelObject=level[tracks[1].position[0]][tracks[1].position[1]];
        let queue="";
        for(let i=0;i<2;i++){
            if(tracks[0].position[0]===tracks[1].position[0]&&tracks[1].position[0]===tracks[2].position[0]&&
                tracks[0].position[1]===tracks[1].position[1]-1&&tracks[1].position[1]===tracks[2].position[1]-1){
                    queue=['left','right'];
            }
            if(tracks[0].position[1]===tracks[1].position[1]&&tracks[1].position[1]===tracks[2].position[1]&&
                tracks[0].position[0]===tracks[1].position[0]-1&&tracks[1].position[0]===tracks[2].position[0]-1){
                    queue=['up','down'];
            }
            if(tracks[0].position[0]===tracks[1].position[0]&&tracks[1].position[0]===tracks[2].position[0]+1&&
                tracks[0].position[1]===tracks[1].position[1]-1&&tracks[1].position[1]===tracks[2].position[1]){
                    queue=['left','up'];
            }
            if(tracks[0].position[0]===tracks[1].position[0]&&tracks[1].position[0]===tracks[2].position[0]-1&&
                tracks[0].position[1]===tracks[1].position[1]-1&&tracks[1].position[1]===tracks[2].position[1]){
                    queue=['left','down'];
            }
            if(tracks[0].position[0]===tracks[1].position[0]-1&&tracks[1].position[0]===tracks[2].position[0]&&
                tracks[0].position[1]===tracks[1].position[1]&&tracks[1].position[1]===tracks[2].position[1]-1){
                    queue=['up','right'];
            }
            if(tracks[0].position[0]===tracks[1].position[0]+1&&tracks[1].position[0]===tracks[2].position[0]&&
                tracks[0].position[1]===tracks[1].position[1]&&tracks[1].position[1]===tracks[2].position[1]-1){
                    queue=['down','right'];
            }
            tracks.reverse();
        }
        if(queue){
            if(correspondingLevelObject.tracks.indexOf(queue)===0){
                correspondingLevelObject.tracks.splice(1);
            }
            else if(correspondingLevelObject.tracks.indexOf(queue)>0){
                correspondingLevelObject.tracks.reverse();
            }
            else if(!correspondingLevelObject.tracks.includes(queue)){
                correspondingLevelObject.tracks.unshift(queue);
            }
        }
        for(let i=0;i<level.length;i++){
            for(let j=0;j<level[i].length;j++){
                let square=level[i][j];
                let cell=playerGrid.childNodes[i].childNodes[j];
                if(square.type==="empty"){
                    cell.innerHTML="";
                    square.tracks.splice(2);
                    for(let k=0;k<square.tracks.length;k++){
                        //cell.innerHTML+=square.tracks[k]+", ";
                    }
                    let check1=(track)=>JSON.stringify(track)==='["left","right"]'||JSON.stringify(track)==='["up","down"]';
                    let check2=(track)=>JSON.stringify(track)==='["left","down"]'||JSON.stringify(track)==='["up","right"]';
                    let check3=(track)=>JSON.stringify(track)==='["left","up"]'||JSON.stringify(track)==='["down","right"]';
                    if(square.tracks.every(check1)||square.tracks.every(check2)||square.tracks.every(check3)){
                        square.swappable=false;
                    }
                    else{
                        square.swappable=true;
                    }
                }
            }
        }
        updateLayers();
    }

    let directionOrder=["left","up","down","right"];
    let betterDirectionOrder=['right','up','left','down'];

    function updateLayers(){
        let boxSize=42;
        let oneTrackCount=0;
        let twoTrackCount=0;
        for(let i=0;i<boardSize;i++){
            for(let j=0;j<boardSize;j++){
                let square=level[i][j];
                square.topLayerCell.innerHTML=square.layer3Cell.innerHTML=square.layer2Cell.innerHTML=square.layer1Cell.innerHTML='';
                square.topLayerCell.style.background=square.layer3Cell.style.background=square.layer2Cell.style.background=square.layer1Cell.style.background='';
                if(square.type==="empty"&&playing){
                    if(square.tracks.length===1){
                        oneTrackCount++;
                    }
                    if(square.tracks.length===2){
                        oneTrackCount++;
                        twoTrackCount++;
                    }
                    if(square.tracks[0]){
                        square.layer2Cell.style.background=`url("images/trainyard/track-${square.tracks[0][0]}-${square.tracks[0][1]}.png")`;
                    }
                    else{
                        square.layer2Cell.style.background='none';
                    }
                    if(square.tracks[1]){
                        if(square.swappable){
                            square.layer1Cell.style.background=`url("images/trainyard/track-${square.tracks[1][0]}-${square.tracks[1][1]}-dark.png")`;
                        }
                        else{
                            square.layer1Cell.style.background=`url("images/trainyard/track-${square.tracks[1][0]}-${square.tracks[1][1]}.png")`;
                        }
                        
                    }
                    else{
                        //square.layer1Cell.style.background='url("images/trainyard/1 sides goal.png")';
                        //square.layer2Cell.style.background='url("images/trainyard/none.png")'
                        square.layer1Cell.style.background='none';
                    }
                }
                else{
                    square.layer1Cell.style.background='none';
                    square.layer2Cell.style.background='none';  
                }
                if(square.selected){
                    square.topLayerCell.style.background='url("images/trainyard/selected.png")';
                }
                else{
                    square.topLayerCell.style.background='none';
                }
                
                if(square.type==="rock"){
                    square.layer1Cell.style.background='url("images/trainyard/rock.png")';
                }
                if(square.type==="scissors"){
                    let direction=square.directions[0];
                    square.layer1Cell.style.background=`url("images/trainyard/scissor-back-${direction}.png")`;
                    square.layer3Cell.style.background=`url("images/trainyard/scissor-${direction}.png")`;
                }
                if(square.type==="paint"){
                    let directions=sortByDirection(square.directions);
                    let color=square.colors[0];
                    square.layer1Cell.style.background=`url("images/trainyard/paint-${directions.join("-")}.png")`;
                    square.layer3Cell.style.background=`url("images/trainyard/paint-${color}.png")`;
                }
                if(square.type==="start"||square.type==="end"){
                    let colors=square.colors;
                    let iconSize=Math.ceil(Math.sqrt(running?square.colorsCopy.length:colors.length));
                    let iconHolder=document.createElement('div');
                    iconHolder.classList.add('multiple-icon-holder');
                    
                    if(square.type==="start"){
                        let direction=square.directions[0];
                        square.layer1Cell.style.background=`url("images/trainyard/start-${direction}.png")`;
                        let spaces=Math.min(Math.pow(iconSize,2),journey+(halfJourney?1:0));
                        for(let i=0;i<spaces;i++){
                            let icon=document.createElement('img');
                            icon.style.width=boxSize/iconSize+"px";
                            icon.style.height=boxSize/iconSize+"px";
                            icon.src='images/trainyard/blank.png';
                            iconHolder.append(icon);
                        }
                    }
                    if(square.type==="end"){
                        if(!square.endFilled){
                            let directions=sortByDirection(square.directions);
                            square.layer1Cell.style.background=`url("images/trainyard/end-${directions.join("-")}.png")`;
                        }
                    }
                    
                    for(let i=0;i<colors.length;i++){
                        let icon=document.createElement('img');
                        icon.style.width=boxSize/iconSize+"px";
                        icon.style.height=boxSize/iconSize+"px";
                        icon.src=(colors[i]==='blank')?'images/trainyard/blank.png':`images/trainyard/${colors[i]}${square.type==="start"?"PLUS":"CIRCLE"}1.png`;
                        iconHolder.append(icon);
                    }
                    if(square.endFilled===true){
                        square.layer3Cell.innerHTML='';
                        square.layer3Cell.style.background='url(images/trainyard/end-complete.png)';
                    }
                    else{
                        square.layer3Cell.style.background=`url(images/trainyard/${square.type==='start'?'startborder':'station'}.png)`;
                        square.layer3Cell.append(iconHolder);
                    }
                }
            }
        }
        winTrackCounter.innerHTML=trackCounter.innerHTML="Tracks: "+oneTrackCount+"+"+twoTrackCount;
        winJourneyCounter.innerHTML=journeyCounter.innerHTML="Journey: "+journey;
        trainStatus.innerHTML="Status: "+(fail?"crashed":"good");
    }

    function endTrack(){
        let different=true;
        if(JSON.stringify(level)===JSON.stringify(previousTracks)){
            different=false;
        }
        if(different){
            trackHistory.unshift(previousTracks);
        }
        tracks=[];
    }

    function switchTrack(cell,position){
        let square=level[position[0]][position[1]];
        if(square.swappable){
            square.tracks.reverse();
        }
        updateLayers();
    }

    function undo(){
        if(trackHistory.length===0){
            return false;
        }
        let newLevel=trackHistory.shift();
        let i=0;
        let j=0;
        newLevel.forEach((row)=>{
            row.forEach((square)=>{
                level[i][j].tracks=square.tracks;
                level[i][j].swappable=square.swappable?true:false;
                j++;
            })
            j=0;
            i++;
        })
        updateLayers();
    }

    var trains=[];
    var journey=0;
    var speed=0;
    var ticks=0;
    var halfJourney=false;
    var startSquares=[];
    var endSquares=[];
    var scissorSquares=[];
    var paintSquares=[];
    var fail=false;
    var won=false;
    
    function startTheTrains(){
        backToTheDrawingBoard();
        trainStatus.style.display="";
        erasingStatus.style.display="none";
        running=true;
        if(erasing){
            eraseButton.click();
        }
        html2canvas(screenshotDiv, {
            allowTaint: true,
            taintTest: false,
        }).then(canvas=>{
            canvasHolder.innerHTML='';
            canvasHolder.append(canvas);
        });
        ticks=100000;
        for(let i=0;i<level.length;i++){
            for(let j=0;j<level[i].length;j++){
                let square=level[i][j];
                square.directionsCopy=copy(square.directions);
                square.colorsCopy=copy(square.colors);
                square.tracksCopy=copy(square.tracks);
                switch(square.type){
                    case 'start':
                        startSquares.push(square);
                        break;
                    case 'end':
                        endSquares.push(square);
                        break;
                    case 'scissors':
                        scissorSquares.push(square);
                        break;
                    case 'paint':
                        paintSquares.push(square);
                        break;
                }
            }
        }
        tick();
        
    }
    
    function backToTheDrawingBoard(){
        if(running&&!won){
            running=false;
        }
        else{
            return false;
        }
        canvasHolderDiv.style.display="none";
        trainStatus.style.display="none";
        erasingStatus.style.display="";
        trains.forEach((train)=>{train.element.remove()});
        level.forEach((row)=>{
            row.forEach((square)=>{
                square.directions=copy(square.directionsCopy);
                square.colors=copy(square.colorsCopy);
                square.tracks=copy(square.tracksCopy);
                square.directionsCopy=[];
                square.colorsCopy=[];
                square.tracksCopy=[];
                square.endFilled=false;
            })
        })
        journey=0;
        halfJourney=false;
        fail=false;
        trains=[];
        startSquares=[];
        endSquares=[];
        scissorSquares=[];
        paintSquares=[];
        updateLayers();
    }

    function win(){
        running=false;
        won=true;
        winDivHolder.style.display='';
        if(challenge){
            backToMenuButton.style.display='';
            editLevelButton.style.display='none';
            if(window.localStorage.getItem('beat'+currentChallenge)==='false'){
                window.localStorage.setItem('stars',parseInt(window.localStorage.getItem('stars'))+challengeStars);
                challengeStars=0;
                window.localStorage.setItem('beat'+currentChallenge,true);
            }
        }
        else{
            backToMenuButton.style.display='none';
            editLevelButton.style.display='';
        }
        //s tier animation
        let angle=0;
        let spinRate=8;
        let opacity=0;
        let interval=setInterval(()=>{
            angle+=spinRate;
            spinRate-=0.03;
            opacity+=0.003;
            winDiv.style.transform=`rotate(${angle}deg)`
            winDiv.style.opacity=opacity;
        })
        setTimeout(()=>{
            clearInterval(interval);
            winDiv.style.opacity=1;
            winDiv.style.transform='rotate(0deg)';
        },1000)
        
    }

    function tick(){
        if(!running){
            return false;
        }
        ticks+=Math.pow(30,speed/100);
        if(ticks>=30){
            ticks=0;
            if(halfJourney){
                journey++;
            }
            //switch tracks
            trains.forEach(train=>{
                //onedge is basically halfjourney
                train.onEdge=train.onEdge?false:true;
                if(train.onEdge){
                    train.square.tracks.reverse();
                }
            });
            //update its position
            for(let i=0;i<trains.length;i++){
                let train=trains[i];
                if(train.onEdge){
                    train.posOnSquare=train.track[train.whichSideAreYouGoingTowards];
                    train.position=eval('train.square.'+train.posOnSquare);
                }
                else{
                    let center=train.track[0]===reverse(train.track[1])?true:false;
                    train.posOnSquare=center?'center':train.track[0]+train.track[1];
                    train.position=eval('train.square.'+train.posOnSquare);
                }
            }
            //check for collision
            for(let i=0;i<trains.length;i++){
                let train=trains[i];
                for(let j=i+1;j<trains.length;j++){
                    if(JSON.stringify(trains[j].position)===JSON.stringify(train.position)&&train.square.type!=='end'){
                        train.collisions.push(copy(trains[j]));
                        trains[j].collisions.push(copy(train));
                        if(trains[j].posOnSquare===train.posOnSquare&&train.onEdge){
                            //merge
                            train.collide(trains[j]);
                            train.crash(true);
                        }
                        else{
                            //collide
                            train.collide(trains[j]);
                        }
                    }
                }
                if(train.collisions.length>1&&!train.collisions.every((idk)=>{return idk.color===train.color})){
                    train.color='brown';
                }
            }
            //move train
            trains.forEach(train=>{
                if(train.onEdge){
                    try{
                    switch(train.posOnSquare){
                        case 'left':
                            train.square=level[train.square.position[0]][train.square.position[1]-1];
                            break;
                        case 'right':
                            train.square=level[train.square.position[0]][train.square.position[1]+1];
                            break;
                        case 'up':
                            train.square=level[train.square.position[0]-1][train.square.position[1]];
                            break;
                        case 'down':
                            train.square=level[train.square.position[0]+1][train.square.position[1]];
                            break;
                    }
                    }catch{
                        train.square=null;
                    }
                    if(!train.square){
                        train.crash();
                    }
                }
            })
            //find a new track
            trains.forEach(train=>{
                if(train.onEdge){
                    train.track=null;
                    if(train.square.type==='empty'){
                        train.square.tracks.forEach(track=>{
                            if(track.indexOf(reverse(train.posOnSquare))>-1&&train.track===null){
                                train.track=track;
                                train.whichSideAreYouGoingTowards=1-track.indexOf(reverse(train.posOnSquare));
                            }
                        });
                    }
                    if(train.square.type==='end'||train.square.type==='paint'||train.square.type==='scissors'){
                        let index=train.square.directions.indexOf(reverse(train.posOnSquare));
                        let thing=train.square.directions[index];
                        if(index>-1){
                            train.track=sortByDirection([thing,reverse(thing)]);
                            train.whichSideAreYouGoingTowards=1-train.track.indexOf(reverse(train.posOnSquare));
                        }
                    }
                    if(train.track===null){
                        train.crash();
                    }
                }
            })
            
            trains.forEach(train=>{
                if(!train.onEdge){
                    let square=train.square;
                    //end check
                    if(square.type==='end'){
                        if(square.colors.indexOf(train.color)===-1){
                            train.crash();
                        }
                        else{
                            train.crash(true);
                            square.colors.splice(square.colors.indexOf(train.color),1,'blank');
                        }
                        if(square.colors.every(color=>{return color==='blank'})){
                            square.endFilled=true;
                            square.directions=[];
                        }
                    }
                    //paint check
                    if(square.type==='paint'){
                        train.color=train.square.colors[0];
                        let thing=square.directions[1-square.directions.indexOf(train.track[1-train.whichSideAreYouGoingTowards])];
                        train.track=sortByDirection([thing,reverse(thing)]);
                        train.whichSideAreYouGoingTowards=train.track.indexOf(thing);
                    }
                    //scissor check
                    if(square.type==='scissors'){
                        let splitColors=['idk','idk'];
                        if(['red','yellow','blue','brown'].includes(train.color)){
                            splitColors[0]=splitColors[1]=train.color;
                        }
                        else{
                            switch(train.color){
                                case 'orange':
                                    splitColors[0]='yellow';
                                    splitColors[1]='red';
                                    break;
                                case 'green':
                                    splitColors[0]='blue';
                                    splitColors[1]='yellow';
                                    break;
                                case 'purple':
                                    splitColors[0]='blue';
                                    splitColors[1]='red';
                                    break;
                            }
                        }
                        let thing=betterDirectionOrder[(betterDirectionOrder.indexOf(train.track[train.whichSideAreYouGoingTowards])+1)%4];
                        train.track=sortByDirection([thing,reverse(thing)]);
                        train.whichSideAreYouGoingTowards=train.track.indexOf(thing);
                        train.color=splitColors[0];
                        trains.push(new Train(splitColors[1],square.center[0],square.center[1],90*(betterDirectionOrder.indexOf(thing)+2),square))
                    }
                }
            })
            
            //clean up
            for(let i=0;i<trains.length;i++){
                let train=trains[i];
                if(train.dead){
                    trains.splice(i,1);
                    i--;
                }
                train.collisions=[];
                train.trainImage.src=`images/trainyard/train-${train.color}.png`;
            }
            //win check
            if(trains.length===0&&endSquares.length>0&&endSquares.every(square=>{return square.colors.every(color=>{return color==='blank'})})&&fail===false){
                win();
            }
            //spawn trains
            if(!halfJourney){
                for(let i=0;i<startSquares.length;i++){
                    let square=startSquares[i];
                    let startAngle=betterDirectionOrder.indexOf(square.directions[0])*90;
                    trains.push(new Train(square.colors.shift(),square.center[0],square.center[1],startAngle,square));
                    if(square.colors.length===0){
                        startSquares.splice(i,1);
                        i--;
                    }
                }
            }
            
            halfJourney=halfJourney?false:true;
        }
        updateLayers();
        trains.forEach(train=>{train.update()});
        requestAnimationFrame(tick);
    }

    class Train {
        constructor(color,x,y,direction,square){
            this.color=color;
            this.x=x;
            this.y=y;
            this.position=square.center;
            this.square=square;
            this.direction=direction;
            this.onEdge=halfJourney;
            this.dead=false;
            this.posOnSquare='center';
            let coolDirection=betterDirectionOrder[(betterDirectionOrder.indexOf(square.directions[0])+1)%4];
            this.track=square.type==="scissors"?sortByDirection([coolDirection,reverse(coolDirection)]):sortByDirection([square.directions[0],reverse(square.directions[0])]);
            this.whichSideAreYouGoingTowards=square.type==="scissors"?this.track.indexOf(coolDirection):this.track.indexOf(square.directions[0]);
            this.collisions=[];
            this.element=document.createElement('div');
            this.element.style.position='absolute';
            this.trainImage=document.createElement('img');
            this.trainImage.src=`images/trainyard/train-${color}.png`;
            this.element.append(this.trainImage);
            this.element.style.zIndex=250;
            layer2.append(this.element);
            return this;
        }
        update() {
            if(JSON.stringify(this.track)==='["left","right"]'){
                this.y=this.square.left[1];
                this.x=this.whichSideAreYouGoingTowards?this.square.left[0]+boxSize*(ticks+(halfJourney?30:0))/60:this.square.right[0]-boxSize*(ticks+(halfJourney?30:0))/60;
                this.direction=this.whichSideAreYouGoingTowards?0:180;
            }
            if(JSON.stringify(this.track)==='["up","down"]'){
                this.x=this.square.down[0];
                this.y=this.whichSideAreYouGoingTowards?this.square.up[1]+boxSize*(ticks+(halfJourney?30:0))/60:this.square.down[1]-boxSize*(ticks+(halfJourney?30:0))/60;
                this.direction=this.whichSideAreYouGoingTowards?270:90;
            }
            if(JSON.stringify(this.track)==='["left","up"]'){
                this.x=this.whichSideAreYouGoingTowards?this.square.left[0]+boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0))):this.square.left[0]+boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0)));
                this.y=this.whichSideAreYouGoingTowards?this.square.up[1]+boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0))):this.square.up[1]+boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0)));
                this.direction=this.whichSideAreYouGoingTowards?3/2*(ticks+(halfJourney?30:0)):270-3/2*(ticks+(halfJourney?30:0));
            }
            if(JSON.stringify(this.track)==='["left","down"]'){
                this.x=this.whichSideAreYouGoingTowards?this.square.left[0]+boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0))):this.square.left[0]+boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0)));
                this.y=this.whichSideAreYouGoingTowards?this.square.down[1]-boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0))):this.square.down[1]-boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0)));
                this.direction=this.whichSideAreYouGoingTowards?-3/2*(ticks+(halfJourney?30:0)):90+3/2*(ticks+(halfJourney?30:0));
            }
            if(JSON.stringify(this.track)==='["up","right"]'){
                this.x=this.whichSideAreYouGoingTowards?this.square.right[0]-boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0))):this.square.right[0]-boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0)));
                this.y=this.whichSideAreYouGoingTowards?this.square.up[1]+boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0))):this.square.up[1]+boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0)));
                this.direction=this.whichSideAreYouGoingTowards?270+3/2*(ticks+(halfJourney?30:0)):180-3/2*(ticks+(halfJourney?30:0));
            }
            if(JSON.stringify(this.track)==='["down","right"]'){
                this.x=this.whichSideAreYouGoingTowards?this.square.right[0]-boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0))):this.square.right[0]-boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0)));
                this.y=this.whichSideAreYouGoingTowards?this.square.down[1]-boxSize/2*Math.sin(3/2*deg(ticks+(halfJourney?30:0))):this.square.down[1]-boxSize/2*Math.cos(3/2*deg(ticks+(halfJourney?30:0)));
                this.direction=this.whichSideAreYouGoingTowards?90-3/2*(ticks+(halfJourney?30:0)):180+3/2*(ticks+(halfJourney?30:0));
            }
            this.element.style.left=this.x+'px';
            this.element.style.top=this.y+'px';
            this.direction=this.direction%360;
            this.element.style.transform='translate(-50%,-50%) rotate('+-this.direction+'deg)';
        }
        crash(safe){
            this.element.remove();
            this.dead=true;
            if(safe){
                return;
            }
            fail=true;
        }
        collide(train){
            //colors in alphabetical order: blue, brown, green, orange, purple, red, yellow
            let colors=[this.color,train.color].sort((a,b)=>{return a>b?1:-1});
            if(colors[0]===colors[1]){
                return;
            }
            this.color='brown';
            train.color='brown';
            switch(colors.join('')){
                case 'redyellow':
                    this.color='orange';
                    train.color='orange';
                    break;
                case 'blueyellow':
                    this.color='green';
                    train.color='green';
                    break;
                case 'bluered':
                    this.color='purple';
                    train.color='purple';
                    break;
            }
        }
    }

    function drawTestDot([x,y]){
        let dot=document.createElement('div');
        dot.style.background='yellow';
        dot.style.width='5px';
        dot.style.height='5px';
        dot.style.position='absolute';
        dot.style.top=y+'px';
        dot.style.left=x+'px';
        dot.style.transform='translate(-50%,-50%)';
        topLayer.append(dot);
        console.log(x,y)
    }

    function copy(x){
        return JSON.parse(JSON.stringify(x));
    }

    function deg(x){
        return x*Math.PI/180;
    }

    function reverse(x){
        switch(x){
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            case 'up':
                return 'down';
            case 'down':
                return 'up';
        }
    }

    function sortByDirection(array){
        return array.sort((a,b)=>{return directionOrder.indexOf(a)-directionOrder.indexOf(b)});
    }

    var hipx=0;
    function cringe(){
        var hippo=document.querySelector("#cool-div");
        hippo.style.transform=`rotate(${hipx}deg)`
        hipx++;
        window.requestAnimationFrame(cringe);
    }
    cringe();
    
    function anticheat(){
        const before = Date.now();
        debugger;
        const after = Date.now();
        if(after-before>100){
            window.onbeforeunload="";
            window.location.reload();
        }
        window.requestAnimationFrame(anticheat);
    }
    //anticheat();

    function stuffToDoImmediatelyFunction(){
        
    }
    stuffToDoImmediatelyFunction();
})