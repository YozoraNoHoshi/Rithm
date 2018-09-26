window.onload = function() {
  let memeGallery = document.getElementById('meme-gallery');
  let addMemeForm = document.getElementById('add-meme');
  let memeCount = 0;

  addMemeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let newGalleryEntry = document.createElement('div');
    newGalleryEntry.className = 'gallery-entry';

    let newGalleryContainer = document.createElement('div');
    newGalleryContainer.className = 'gallery-container';

    let newImg = document.createElement('img');
    newImg.src = document.getElementById('meme-link').value;
    newImg.className = 'meme';

    let imgTop = document.createElement('div');
    imgTop.innerText = document.getElementById('meme-top').value;
    imgTop.className = 'top-kek';

    let imgBtm = document.createElement('div');
    imgBtm.innerText = document.getElementById('meme-bottom').value;
    imgBtm.className = 'btm-kek';

    let delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';

    newGalleryContainer.appendChild(newImg);
    newGalleryContainer.appendChild(imgTop);
    newGalleryContainer.appendChild(imgBtm);
    newGalleryEntry.appendChild(newGalleryContainer);
    newGalleryEntry.appendChild(delBtn);
    memeGallery.appendChild(newGalleryEntry);

    document.getElementById('gallery-count').style.display = 'none';

    addMemeForm.reset();
    memeCount += 1;
  });

  memeGallery.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'button') {
      event.target.parentNode.remove();
      memeCount -= 1;

      if (memeCount === 0) {
        document.getElementById('gallery-count').style.display = 'initial';
      }
    }
  });
};
