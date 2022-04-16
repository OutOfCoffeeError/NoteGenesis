const whiteKeys = ['C','D','E','F','G','A','B'];
const action = {
    '144':'P',
    '128': 'R'
}
let noOfKeys = 61;
pianoReady();

function pianoReady() {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(midiAccess) {
        console.log(midiAccess);

        midiAccess.onstatechange = event => {

            console.log(event.port.name, event.port.manufacturer, event.port.state);
        };

        drawPiano();
        var inputs = midiAccess.inputs;
        
        for (var input of inputs.values()) {
            input.onmidimessage = function (params) {
                console.log(params.data[0] + "   " + params.data[1]);
                let keyAction = params.data[0];
                let keyNo = params.data[1];
                let keyEl = document.getElementById(keyNo);
                let note = keyEl.getAttribute('note');
                let tmpClass;
                if(action[keyAction] == 'P') {
                    tmpClass = keyEl.className+' '+'pressed';
                } else {
                    tmpClass = keyEl.className.split(' ')[0];
                    if(!'FC'.split('').includes(note)) {
                        tmpClass += ' offset'
                    } 
                }
                keyEl.className = tmpClass;
            }
        }

        var outputs = midiAccess.outputs;
        console.log(outputs);


    }
    function getMIDIMessage(midiMessage) {
        console.log(midiMessage);
    }
    function onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
    }
}

function drawPiano() {
    let startKeyId = 36;
    let keyboard = document.getElementById("keyboard");
    let counter=1;
    while(true){
        if(counter > noOfKeys) break;
        for(let key of whiteKeys) {
            if(counter > noOfKeys) break;
            let whiteKeyEl = document.createElement('li'); 
            let tmpClass = 'white ';
            if(!'FC'.split('').includes(key)) {
                tmpClass += 'offset'
            } 
            whiteKeyEl.className = tmpClass;
            whiteKeyEl.id = startKeyId++;
            whiteKeyEl.setAttribute('note', key);
            whiteKeyEl.textContent = key;
            keyboard.append(whiteKeyEl);
            console.log(counter);
            
            counter++;
            if('CDFGA'.split('').includes(key)) {
                if(counter > noOfKeys) break;
                let blackKeyEl = document.createElement('li');
                blackKeyEl.className = 'black';
                blackKeyEl.setAttribute('note', key+"#");
                blackKeyEl.id = startKeyId++;
                blackKeyEl.textContent = key+"#";
                keyboard.append(blackKeyEl);
                counter++;
            }

            
        }
    }

}