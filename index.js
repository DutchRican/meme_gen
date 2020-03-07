document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let topCaption = '';
    let bottomCaption = '';
    let fontSize = 25;
    let fontFamily = 'Arial';
    let fontStrokeColor = '#fff';
    let fontFillColor = '#fff';
    const TOP = 'TOP';
    const BOTTOM = 'BOTTOM';

    const locationSelector = { TOP: topCaption, BOTTOM: bottomCaption };

    // collecting inputs
    const topCaptionInput = document.getElementById('topCaption');
    const bottomCaptionInput = document.getElementById('bottomCaption');
    const fontSizeInput = document.getElementById('fontSize');
    const fontFamilyInput = document.getElementById('fontFamily');
    const imageCollection = document.getElementById('imageCollection');
    const fontFillInput = document.getElementById('fontFillColor');
    const fontStrokeInput = document.getElementById('fontStrokeColor');
    const saveButton = document.getElementById('saveImage');
    const dropMessage = document.getElementById('dropMessage');

    topCaptionInput.addEventListener('input', (evt) => setText(evt, TOP));
    bottomCaptionInput.addEventListener('input', (evt) => setText(evt, BOTTOM));
    fontSizeInput.addEventListener('change', (evt) => { fontSize = parseInt(evt.target.value); drawImage() });
    fontFamilyInput.addEventListener('change', (evt) => { fontFamily = evt.target.value; drawImage() });
    fontFillInput.addEventListener('change', (evt) => { fontFillColor = evt.target.value; drawImage() });
    fontStrokeInput.addEventListener('change', (evt) => { fontStrokeColor = evt.target.value; drawImage() });
    imageCollection.addEventListener('change', evt => {img.src = evt.target.value; drawImage();});

    const getImages = (results) => {
        if (!results) return;
        const images = results[0].filter(img => img.height > 60); // getting rid of anything way too small
        for (let image of images) {
            const opt = document.createElement('option');
            opt.appendChild(document.createTextNode(image.alt || 'no name image'));
            opt.value = image.src;
            imageCollection.appendChild(opt);
            topCaptionInput.focus();
        }
        img.src = images[0].src;
        drawImage();
    }

    chrome &&  chrome.tabs && chrome.tabs.getSelected(null, tab => {
        chrome.tabs.executeScript(
            tab.id,
            {code: 'Array.prototype.map.call(document.querySelectorAll("img"), img => ({src:img.src, alt:img.alt, height:img.height}))'}
          , getImages);
    });

    saveButton.addEventListener('click', () => saveImage());

    document.addEventListener('dragenter', evt => {
        evt.preventDefault();
        dropMessage.style.display = 'block';
    });
    document.addEventListener('dragleave', evt => {
        evt.preventDefault();
        dropMessage.style.display = 'none';
    });

    document.addEventListener('dragover', evt => {
        evt.preventDefault();
    });

    document.addEventListener('drop', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const url = evt.dataTransfer.getData('URL');
        dropMessage.style.display = 'none';
        img.src = url;
    }, false);

    // setup image 
    const img = new Image;
    img.crossOrigin = 'anonymous';
    img.sameSite = 'None'
    img.onload = drawImage;

    function setText(event, selector) {
        const newText = event.target.value;
        selector === TOP ? topCaption = newText : bottomCaption = newText;
        drawImage();
    }

    function drawImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio);
        drawText(topCaption, 30, ratio);
        drawText(bottomCaption, img.height * ratio - ((img.height * ratio) / 10), ratio);
    }

    function drawText(text, yVal, ratio) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = fontStrokeColor;
        ctx.fillStyle = fontFillColor;

        ctx.textAlign = 'start';
        ctx.font = `${fontSize}px ${fontFamily}`;
        textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (img.width * ratio - textWidth) / 2, yVal);
        ctx.strokeText(text, (img.width * ratio - textWidth) / 2, yVal);
    }

    function saveImage() {
        const newImg = canvas.toDataURL();
        let link = document.createElement('a');
        link.download = 'image.png';
        link.href = newImg;
        link.click();
    }
}, false);