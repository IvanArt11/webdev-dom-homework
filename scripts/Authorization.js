import { display, isAuthorized } from "./script.js";

const url = "https://webdev-hw-api.vercel.app/api/user";

const authComponent = (login) => {
  return `
    ${`
    <div class="auth-btn-wrap">
    ${
      isAuthorized
        ? `
            <div>Вы вошли как ${login.name},</div> 
            <button class="logout">Выйти</button>
        `
        : `   
            <button class="auth-btn auth-btn-login">Вход</button>
            <button class="auth-btn auth-btn-register">Регистрация</button>
        `
    }
    </div> 
    `}
 
    ${
      display !== "none"
        ? `
    <div class="authorization">
        <div class="auth-wrap">
            <p class="auth-status"> ${
              display == "login" ? "Вход" : "Регистрация"
            }</p>
            ${
              display == "registration"
                ? '<input class="auth-name" type="text" placeholder="Введите имя">'
                : ""
            }
            <input class="auth-login" type="text" placeholder="Введите логин">
            <input class="auth-pass" type="password" placeholder="Введите пароль">
            <div class="-error">Ошибка</div>
            <button class="auth-login-btn inactive">${
              display == "login" ? "Войти" : "Зарегистрироваться"
            }</button>
            <button class="auth-switch">${
              display == "login" ? "Еще нет аккаунта?" : "Уже есть аккаунт?"
            }</button>
        </div>
    </div>
    `
        : ""
    }
    `;
};

const loginApi = (login) => {
  return fetch(url + "/login", {
    method: "POST",
    body: JSON.stringify({
      login: login.login,
      password: login.password,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw Error("400");
    }
  });
};

const registerApi = (login) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      login: login.login,
      name: login.name,
      password: login.password,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw Error("400");
    }
    throw Error();
  });
};

export { authComponent, registerApi, loginApi };