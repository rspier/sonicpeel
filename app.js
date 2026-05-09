const { createFFmpeg, fetchFile } = FFmpeg;

let ffmpeg = null;

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const mainCard = document.getElementById('main-card');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const processingView = document.getElementById('processing-view');
const successView = document.getElementById('success-view');
const progressBar = document.getElementById('progress-bar');
const percentageText = document.getElementById('percentageText');
const statusText = document.getElementById('status-text');
const consoleOutput = document.getElementById('console-output');
const waveform = document.getElementById('waveform');
const filenameDisplay = document.getElementById('filename-display');
const downloadLink = document.getElementById('download-link');
const resetBtn = document.getElementById('reset-btn');

// Initialize Waveform Bars
function createWaveform() {
    waveform.innerHTML = '';
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        const scale = 0.2 + Math.random() * 0.8;
        const delay = Math.random() * 2;
        bar.style.height = `${scale * 100}%`;
        bar.style.animationDelay = `${delay}s`;
        waveform.appendChild(bar);
    }
}

// Initialize FFmpeg
async function initFFmpeg() {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = createFFmpeg({ 
        log: true,
        // Using unpkg for core to ensure compatibility with 0.11.6
        corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
    });
    
    ffmpeg.setLogger(({ type, message }) => {
        console.log(message);
        consoleOutput.textContent = message;
    });

    ffmpeg.setProgress(({ ratio }) => {
        const percent = Math.round(ratio * 100);
        progressBar.style.width = `${percent}%`;
        percentageText.textContent = `${percent}%`;
    });

    await ffmpeg.load();
    return ffmpeg;
}

// File Handling
async function handleFile(file) {
    if (!file) return;
    
    // Trigger Peeling Animation
    mainCard.classList.add('peeling-active');
    
    // Wait for animation to finish before switching view
    setTimeout(() => {
        dropZone.classList.add('hidden');
        processingView.classList.remove('hidden');
        createWaveform();
    }, 800);
    
    try {
        statusText.textContent = 'Spinning up engines...';
        await initFFmpeg();
        
        statusText.textContent = 'Feeding the machine...';
        const inputName = file.name;
        const outputName = inputName.replace(/\.[^/.]+$/, "") + ".mp3";
        
        ffmpeg.FS('writeFile', inputName, await fetchFile(file));
        
        statusText.textContent = 'Grinding video to audio...';
        // Command: -i input -vn -ab 192k -ar 44100 -y output.mp3
        await ffmpeg.run('-i', inputName, '-vn', '-ab', '192k', '-ar', '44100', '-y', outputName);
        
        const data = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));
        
        // Show Success
        processingView.classList.add('hidden');
        successView.classList.remove('hidden');
        filenameDisplay.textContent = outputName;
        downloadLink.href = url;
        downloadLink.download = outputName;
        
    } catch (error) {
        console.error('FFmpeg Error:', error);
        alert('An error occurred during extraction: ' + error.message);
        resetApp();
    }
}

function resetApp() {
    mainCard.classList.remove('peeling-active');
    dropZone.classList.remove('hidden');
    processingView.classList.add('hidden');
    successView.classList.add('hidden');
    progressBar.style.width = '0%';
    percentageText.textContent = '0%';
    fileInput.value = '';
}

// Event Listeners
const triggerInput = () => fileInput.click();

dropZone.addEventListener('click', triggerInput);
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerInput();
});

fileInput.addEventListener('click', (e) => {
    e.stopPropagation();
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
});

resetBtn.addEventListener('click', resetApp);

// Initialize UI
createWaveform();
