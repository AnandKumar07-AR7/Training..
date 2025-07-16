const form = document.getElementById('cardForm');
  const cardsContainer = document.getElementById('cardsContainer');
  const previewArea = document.getElementById('previewArea');

  let cards = JSON.parse(localStorage.getItem('cards')) || [];

  window.onload = () => {
    cards.forEach(createCard);
  };

  function previewCard() {
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const borderStyle = document.getElementById('borderStyle').value;
    const file = document.getElementById('image').files[0];
    
    if (!name || !bio || !file) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imgURL = e.target.result;
      previewArea.innerHTML = `
        <h3 style="text-align:center;">Preview</h3>
        <div class="card ${borderStyle}">
          <img src="${imgURL}" />
          <div class="card-content">
            <div class="name">${name}</div>
            <div class="bio">${bio}</div>
          </div>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const borderStyle = document.getElementById('borderStyle').value;
    const file = document.getElementById('image').files[0];
    
    if (!name || !bio || !file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const card = {
        id: Date.now(),
        name,
        bio,
        img: e.target.result,
        borderStyle,
        theme: 'light'
      };
      cards.push(card);
      localStorage.setItem('cards', JSON.stringify(cards));
      createCard(card);
      form.reset();
      previewArea.innerHTML = '';
    };
    reader.readAsDataURL(file);
  });

  function createCard(card) {
    const div = document.createElement('div');
    div.className = "card ${card.borderStyle} ${card.theme" === 'dark' ? 'dark' : ''};
    div.setAttribute('data-id', card.id);
    div.innerHTML = `
      <img src="${card.img}" />
      <div class="card-content">
        <div class="name">${card.name}</div>
        <div class="bio">${card.bio}</div>
      </div>
      <div class="card-actions">
        <button onclick="toggleTheme(${card.id})" class="light-btn">Toggle Theme</button>
        <button onclick="editCard(${card.id})" class="dark-btn">Edit</button>
        <button onclick="deleteCard(${card.id})" class="light-btn">Delete</button>
      </div>
    `;
    cardsContainer.appendChild(div);
  

  function deleteCard(id) {
    cards = cards.filter(card => card.id !== id);
    localStorage.setItem('cards', JSON.stringify(cards));
    document.querySelector('[data-id=${id}]').remove();
  }

  function toggleTheme(id) {
    cards = cards.map(card => {
      if (card.id === id) {
        card.theme = card.theme === 'light' ? 'dark' : 'light';
      }
      return card;
    });
    localStorage.setItem('cards', JSON.stringify(cards));
    cardsContainer.innerHTML = '';
    cards.forEach(createCard);
  }

  function editCard(id) {
    const card = cards.find(c => c.id === id);
    document.getElementById('name').value = card.name;
    document.getElementById('bio').value = card.bio;
    document.getElementById('borderStyle').value = card.borderStyle;
    document.querySelector('[data-id=${id}]').remove();
    cards = cards.filter(c => c.id !== id);
    localStorage.setItem('cards', JSON.stringify(cards));
  }