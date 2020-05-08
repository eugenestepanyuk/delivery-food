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

const getData = async (url) => {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Error on ${url}, status - ${response.status}`);
  }
  return await response.json();
}

const valid = function(str) {
  const nameValid = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameValid.test(str);
}

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

    localStorage.setItem('login', login);           // Добавляем в Local Storage значение login
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

// Функция проверки авторизации
function checkAuth() {
  if(login) {
    autorized();
  } else {
    notAutorized();
  }
}

// Функция создания карточки с рестораном
function createCardRestaurant(restaurant) {
  const { 
    image, 
    kitchen, 
    name, 
    price, 
    stars, 
    products, 
    time_of_delivery: timeOfDelivery 
  } = restaurant;

  const card = `
    <a class="card card-restaurant" data-products="${products}" data-info="${[kitchen + '|' + name + '|' + price + '|' + stars]}">
      <img src="${image}" alt="image" class="card-image"/>

        <div class="card-text">

          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery}</span>
          </div> <!-- /.card-heading -->

          <div class="card-info">
            <div class="rating">${stars}</div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div> <!-- /.card-info -->

        </div> <!-- /.card-text -->

    </a> <!-- /.card --> `;
  
  cardsRestaurants.insertAdjacentHTML('beforeend', card);           // Вставляем карточку в разметку
}

// Функция оздания карточки с меню
function createCardGood(goods) {
  const { 
    description, 
    image, 
    name, 
    price 
  } = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image"/>
    
    <div class="card-text">
    
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div> <!-- /.card-heading -->
      
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div> <!-- /.card-info -->
      
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div> <!-- /.card-buttons -->
      
    </div> <!-- /.card-text --> `);
  
  cardsMenu.insertAdjacentElement('beforeend', card);
}

// Открывание меню по клику на ресторан
function openGoods(event) {
  const target = event.target;          // Получаем место клика

  // const restaurantTitle = document.querySelector('.restaurant-title');
  // const minPrice = document.querySelector('.price');
  // const category = document.querySelector('.category');
  // const rating = document.querySelector('.rating');

  if(login) {
    const targetRestaurant = target.closest('.card-restaurant');      // Ищет элемент идя вверх по разметке
    const [kitchen, name, price, stars] = targetRestaurant.dataset.info.split('|');
    
    if(targetRestaurant) {
      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurant.classList.add('hide');
      menu.classList.remove('hide');

      const headRestaurants = document.querySelector('.head-restaurants');
      headRestaurants.querySelector('.restaurant-title').textContent = name;
      headRestaurants.querySelector('.price').textContent = `От ${price} ₽`;
      headRestaurants.querySelector('.category').textContent = kitchen;
      headRestaurants.querySelector('.rating').textContent = stars;

      getData(`./db/${targetRestaurant.dataset.products}`).then((data) => {
        data.forEach(createCardGood);
      });
    } 
  } else {
    toggleModalAuth();
  }
}


function init() {
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurant.classList.remove('hide');
    menu.classList.add('hide'); 
  });

  checkAuth();


  // Слайдер
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000
    },
    slidesPerView: 1,
    slidesPerColumn: 1
  });
}

init();