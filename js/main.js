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
const cartBody = document.querySelector('.cart-body');
const totalPriceCart = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const buttonPrimaryCart = document.querySelector('.primary-cart');


let login = localStorage.getItem('login');                //  Получаем сохраненного пользователя
let password = localStorage.getItem('password');          //  Получаем сохраненного пользователя

let cart = [];        // Массив, который будет хранить в себе элементы корзины

const getData = async (url) => {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Error on ${url}, status - ${response.status}`);
  }
  return await response.json();
}

// Валидация введения логина
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

// Если пользователь не залогиненный, возврат на главное меню
function returnMain() {
  containerPromo.classList.remove('hide');
  restaurant.classList.remove('hide');
  menu.classList.add('hide');
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
    cartButton.style.display = '';
    outButton.removeEventListener('click', logOut)

    checkAuth(); 
    returnMain();
  }
  console.log('Autorized');

  userName.textContent = login;         // Присваеваем текстовое значение login спауну

  authButton.style.display = 'none';    // Скрываем кнопку "Войти"
  userName.style.display = 'inline';
  outButton.style.display = 'flex';
  cartButton.style.display = 'flex';
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
    price,
    id
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
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div> <!-- /.card-buttons -->
      
    </div> <!-- /.card-text --> `);
  
  cardsMenu.insertAdjacentElement('beforeend', card);
}

// Открывание меню по клику на ресторан
function openGoods(event) {
  const target = event.target;          // Получаем место клика

  if(login) {
    const targetRestaurant = target.closest('.card-restaurant');                        // Ищет элемент идя вверх по разметке
    const [kitchen, name, price, stars] = targetRestaurant.dataset.info.split('|');     // Получение данных с data-info карточки ресторана
    
    if(targetRestaurant) {
      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurant.classList.add('hide');
      menu.classList.remove('hide');

      // Приравнивание данных к элементам шапки меню
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

// Функция добавления товара в корзину
function addToCart(event) {
  const target = event.target;
  const buttonAddToCard = target.closest('.button-add-cart');
  
  if(buttonAddToCard) {
    const card = target.closest('.card');                                     // Получение карточку с меню
    const title = card.querySelector('.card-title-reg').textContent;          // Получение имени товара
    const cost = card.querySelector('.card-price').textContent;               // Получение цены товара
    const id = buttonAddToCard.id;                                            // Получение id товара

    // Проверка на наличие товара в корзине
    const food = cart.find((item) => {
      return item.id === id;
    });
    // Если есть, увеличиваем кол-во на 1
    if(food){
      food.count += 1;
    } else {
        cart.push({        
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

// Функция заполнения корзины
function renderCart() {
  cartBody.textContent = '';

  cart.forEach((item) => {
    const {
      id, 
      title, 
      cost, 
      count 
    } = item;
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} ₽</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
			</div>
      <!-- /.foods-row --> `;
      
      cartBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  totalPriceCart.textContent = totalPrice + ' ₽';
}

// Функция изменения кол-ва товара (кнопки -\+)
function changeCount(event) {
  const target = event.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });

    // При нажатии на кнопку проверяет существует ли класс 'counter-minus'
    if(target.classList.contains('counter-minus')) {
      food.count--;
      // Если кол-во товара = 0, то он удаляется с корзины
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    // При нажатии на кнопку проверяет существует ли класс 'counter-plus'
    if(target.classList.contains('counter-plus')) food.count++;

    renderCart();
  }
}



function init() {
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener('click', () => {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

  buttonPrimaryCart.addEventListener('click', () => {
    localStorage.setItem('primaryCart', JSON.stringify(cart));
  });

  cartBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', () => {
    returnMain();
  });

  checkAuth();


  // Слайдер
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000
    },
    speed: 2000,
    slidesPerView: 1,
    slidesPerColumn: 1
  });
}

init();