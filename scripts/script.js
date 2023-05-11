import { getCommentsApi, postCommentsApi } from "./api.js";
import { renderAllComments } from "./render.js";
import { getEvent } from "./events.js";
import { authComponent, registerApi, loginApi } from "./Authorization.js";

const container = document.querySelector(".container");

// Добавление массива комментариев
let commentsArr = [];

// Добавление и формирование даты и времени
const getDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const login = !localStorage.getItem("login")
  ? {
      login: "",
      password: "",
      name: "",
      token: "",
    }
  : JSON.parse(localStorage.getItem("login"));

let display = "none";

let isAuthorized = Boolean(localStorage.getItem("isAuthorized") === "true");

const renderApp = () => {
  container.innerHTML = `
    <div class="preloader">
        <p>Подождите, идет загрузка </p>
        <img class="preload" src="https://pear-advert.ru/images/uploads/blog/273/new-loading.gif" alt="preloader">
    </div>
    ${display === "none" ? `<ul class="comments"></ul>` : ""}
    ${
      isAuthorized
        ? `
          <div class="add-form">
            <div class="add-form-name">${login.name}</div>
            <textarea
              type="textarea"
              class="add-form-text"
              placeholder="Введите ваш комментарий"
              rows="4"
            ></textarea>
            <div class="add-form-row">
              <button class="add-form-button inactive">Написать</button>
            </div>
          </div>
        `
        : `  
          <div class="tips-wrap">
            <div>Чтобы добавить комментарий,</div>
            <buttun class="tips-auth">авторизуйтесь</button>
          </div>
        `
    }
    ${authComponent(login)}
  `;
};

// Получение всех комментариев из API
const getComments = () => {
  preloader.classList.add("--ON");
  if (isAuthorized) {
    addForm.classList.remove("--ON");
  } else {
    tipsWrap.classList.remove("--ON");
  }
  getCommentsApi(login)
    .then((data) => {
      commentsArr = data.comments;
      renderAllComments();
      isAuthorized && getEvent();
      preloader.classList.remove("--ON");
      if (isAuthorized) {
        addForm.classList.add("--ON");
      } else {
        tipsWrap.classList.add("--ON");
      }
    })
    .catch(() => {
      alert("Что-то не так");
    });
};

const sendComment = () => {
  // проверка на пустые поля
  if (!inputText.value.trim().length) return;

  preloader.classList.add("--ON");
  addForm.classList.remove("--ON");

  postCommentsApi(inputText.value, login.token)
    .then((data) => {
      if (data.result === "ok") {
        getComments();
        inputText.value = "";
        // Кнопка снова становится неактивной после добавления комментария, т.к. все поля пустые
        switchButton();
      }
    })
    .catch((error) => {
      if (error.message === "500") {
        console.log("Сервер упал");
        return sendComment();
      } else if (error.message === "Имя и комментарий должны быть не короче 3 символов" /*"400"*/) {
          alert("Имя и комментарий должны быть не короче 3 символов");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
      preloader.classList.remove("--ON");
      addForm.classList.add("--ON");
    });
};

// Если пользователь напишет сообщение, а затем его решит стереть.
const switchButton = () => {
  // Проверка на > 3 так как в другом случае api даст ошибку
  if (inputText.value.trim().length) 
  {
    buttonAdd.classList.add("active");
    buttonAdd.classList.remove("inactive");
  } else {
    buttonAdd.classList.add("inactive");
    buttonAdd.classList.remove("active");
  }
};

const switchButtonAuth = () => {
  const authLogin = document.querySelector(".auth-login");
  const authPass = document.querySelector(".auth-pass");
  const btnAuth = document.querySelector(".auth-login-btn");

  document.querySelector('.-error').classList.remove('--ON');

  if (authLogin.value.length && authPass.value.length) {
    btnAuth.classList.add("active");
    btnAuth.classList.remove("inactive");
  } else {
    btnAuth.classList.add("inactive");
    btnAuth.classList.remove("active");
  }
};

const switchButtonReg = () => {
  const authName = document.querySelector(".auth-name");
  const authLogin = document.querySelector(".auth-login");
  const authPass = document.querySelector(".auth-pass");
  const btnAuth = document.querySelector(".auth-login-btn");

  document.querySelector('.-error').classList.remove('--ON');

  if (
    authLogin.value.length &&
    authPass.value.length &&
    authName.value.length
  ) {
    btnAuth.classList.add("active");
    btnAuth.classList.remove("inactive");
  } else {
    btnAuth.classList.add("inactive");
    btnAuth.classList.remove("active");
  }
};

const applicationLogin = () => {
  const authLogin = document.querySelector(".auth-login").value;
  const authPass = document.querySelector(".auth-pass").value;

  // Валидация
  if (!authLogin.length || !authPass.length) return;

  login.login = authLogin;
  login.password = authPass;

  loginApi(login)
    .then((data) => {
      login.name = data.user.name;
      login.token = data.user.token;
      setDisplay("none");
      setAuthorized(true);
      localStorage.setItem("login", JSON.stringify(login));
    })
    .catch((error) => {
      if (error.message === "Неправильный логин или пароль" /*"400"*/) {
        const error = document.querySelector('.-error');
        error.classList.add('--ON');
        error.innerHTML = "Неправильный логин или пароль";
      } else {
        alert("Что-то не так");
      }
    });
};

const applicationRegister = () => {
  const authLogin = document.querySelector(".auth-login").value;
  const authPass = document.querySelector(".auth-pass").value;
  const authName = document.querySelector(".auth-name").value;

  // Валидация
  if (!authLogin.length || !authPass.length || !authName.length) return;

  login.name = authName;
  login.login = authLogin;
  login.password = authPass;

  registerApi(login)
    .then((data) => {
      login.login = data.user.login;
      login.password = data.user.password;
      login.name = data.user.name;
      login.token = data.user.token;
      setDisplay("none");
      setAuthorized(true);
      localStorage.setItem("login", JSON.stringify(login));
    })
    .catch((error) => {
      if (error.message === "Такой пользователь уже зарегистрирован" /*"400"*/) {
        const error = document.querySelector('.-error');
        error.classList.add('--ON');
        error.innerHTML = "Такой пользователь уже зарегистрирован";
      } else {
        alert("Что-то не так");
      }
    });
};

const logout = () => {
  login.login = "";
  login.password = "";
  login.token = "";
  login.name = "";
  localStorage.setItem("login", JSON.stringify(login));
  setAuthorized(false);
};

const getElementAndEvent = () => {
  if (isAuthorized) {
    inputText = document.querySelector(".add-form-text");
    buttonAdd = document.querySelector(".add-form-button");
    addForm = document.querySelector(".add-form");

    buttonAdd.addEventListener("click", sendComment);

    // После написания текста Enter срабатывал как переход на следующую строку. Добавление события keydown поменяло его использование. Теперь при нажатии Enter публикуется комментарий.
    inputText.addEventListener("keydown", (key) => {
      if (key.code === "Enter") {
        key.preventDefault();
        sendComment();
      }
    });

    inputText.addEventListener("input", switchButton);

    document.querySelector(".logout").addEventListener("click", () => {
      logout();
    });
  } else {
    tipsWrap = document.querySelector(".tips-wrap");

    document
      .querySelector(".auth-btn-login")
      .addEventListener("click", () => setDisplay("login"));
    document
      .querySelector(".auth-btn-register")
      .addEventListener("click", () => setDisplay("registration"));
    document
      .querySelector(".tips-auth")
      .addEventListener("click", () => setDisplay("login"));

    if (display !== "none") {
      document
        .querySelector(".auth-switch")
        .addEventListener("click", () =>
          setDisplay(`${display === "login" ? "registration" : "login"}`)
        );
      const authLogin = document.querySelector(".auth-login");
      const authPass = document.querySelector(".auth-pass");
      const authLoginBtn = document.querySelector(".auth-login-btn");
      authLogin.addEventListener("keydown", (key) => {
        if (key.code === "Enter") {
          key.preventDefault();
          authPass.focus();
        }
      });
      if (display === "login") {
        authLoginBtn.addEventListener("click", () => {
          applicationLogin();
        });

        authPass.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            applicationLogin();
          }
        });

        // Смена цвета кнопки входа
        authLogin.addEventListener("input", switchButtonAuth);
        authPass.addEventListener("input", switchButtonAuth);
      }
      if (display === "registration") {
        const authName = document.querySelector(".auth-name");
        authName.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            authLogin.focus();
          }
        });
        authLoginBtn.addEventListener("click", () => {
          applicationRegister();
        });

        authPass.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            applicationRegister();
          }
        });
        // Смена цвета кнопки регистрации
        authName.addEventListener("input", switchButtonReg);
        authLogin.addEventListener("input", switchButtonReg);
        authPass.addEventListener("input", switchButtonReg);
      }
    }
  }
};

const setDisplay = (status) => {
  display = status;
  renderApp();
  getElementAndEvent();
};

const setAuthorized = (status) => {
  isAuthorized = status;
  localStorage.setItem("isAuthorized", status.toString());
  renderApp();
  getElementAndEvent();
  getComments();
};

renderApp();
const preloader = document.querySelector(".preloader");

//Статичные элементы и ивенты
let addForm = null;
let tipsWrap = null;
let inputText = null;
let buttonAdd = null;
getElementAndEvent();

getComments();

export { commentsArr, display, isAuthorized, getDate };