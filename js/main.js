const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const authButton = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuthButton = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const outButton = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurant = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('login');       //  Получаем сохраненного пользователя
let password = localStorage.getItem('password');       //  Получаем сохраненного пользователя

function toggleModal() {
  modal.classList.toggle("is-open");
}

// Функция для переключения доступа к классу
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function autorized() {
  function logOut() {
    login = null;
    password = null;
    localStorage.removeItem('login');
    localStorage.removeItem('password');

    // Сбрасываем все значения после выхода
    authButton.style.display = '';
    userName.style.display = '';
    outButton.style.display = '';
    outButton.removeEventListener('click', logOut)

    checkAuth();
  }
  console.log('Autorized');

  userName.textContent = login;         // Присваеваем текстовое значение login спауну

  authButton.style.display = 'none';    // Скрываем кнопку "Войти"
  userName.style.display = 'inline';
  outButton.style.display = 'block';

  outButton.addEventListener('click', logOut)
}

function notAutorized() {
  console.log('Not autorized');

  function logIn(event) {
    event.preventDefault();     // блокируем перезагрузку страницы по нажатию на кнопку "Войти"
    login = loginInput.value;
    password = passwordInput.value;

    if(login == '') {
      loginInput.style.borderColor = 'red';
      loginInput.placeholder = 'Введите логин';
      return false;
    }
    if(password == '') {
      passwordInput.style.borderColor = 'red';
      passwordInput.placeholder = 'Введите пароль';
      return false;
    }

    localStorage.setItem('login', login);     // Добавляем в Local Storage значение login
    localStorage.setItem('password', password);     // Добавляем в Local Storage значение password
    toggleModalAuth();

    // Очищяем события
    authButton.removeEventListener('click', toggleModalAuth);
    closeAuthButton.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    
    logInForm.reset();        // Сбрасываем значения формы

    checkAuth();
  }

  authButton.addEventListener('click', toggleModalAuth);
  closeAuthButton.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if(login) {
    autorized();
  } else {
    notAutorized();
  }
}


function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>

        <div class="card-text">

          <div class="card-heading">
            <h3 class="card-title">Тануки</h3>
            <span class="card-tag tag">60 мин</span>
          </div> <!-- /.card-heading -->

          <div class="card-info">
            <div class="rating">4.5</div>
            <div class="price">От 1 200 ₽</div>
            <div class="category">Суши, роллы</div>
          </div> <!-- /.card-info -->

        </div> <!-- /.card-text -->

    </a> <!-- /.card --> `;
  
  cardsRestaurants.insertAdjacentHTML('beforeend', card);           // Вставляем карточку в разметку
}


function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    
    <div class="card-text">
    
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div> <!-- /.card-heading -->
      
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.</div>
      </div> <!-- /.card-info -->
      
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div> <!-- /.card-buttons -->
      
    </div> <!-- /.card-text --> `);
  
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  if(login) {
    const target = event.target;          // Получаем место клика

    const targetRestaurant = target.closest('.card-restaurant');      // Ищет элемент идя вверх по разметке
    
    if(targetRestaurant) {
      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurant.classList.add('hide');
      menu.classList.remove('hide'); 
    
      createCardGood();
    } 
  } else {
    toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurant.classList.remove('hide');
  menu.classList.add('hide'); 
});


checkAuth();
createCardRestaurant();