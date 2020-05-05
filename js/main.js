const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const authButton = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuthButton = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const outButton = document.querySelector('.button-out');

let login = localStorage.getItem('login');       //  Получаем сохраненного пользователя
let password = localStorage.getItem('password');       //  Получаем сохраненного пользователя

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

checkAuth();

