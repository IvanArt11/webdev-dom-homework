import { getCommentsApi, postCommentsApi } from "./api.js";
import { renderAllComments } from "./render.js";
import { getEvent } from "./events.js";

const inputName = document.querySelector(".add-form-name");
// const nameInputElement = document.getElementById("name-input");
const inputText = document.querySelector(".add-form-text");
// const commentsInputElement = document.getElementById("comments-input");
const comments = document.querySelector(".comments");
// const listElement = document.getElementById("list");
const button = document.querySelector(".add-form-button");
// const buttonElement = document.getElementById("add-button");
const preloader = document.querySelector(".preloader");
const addForm = document.querySelector('.add-form');

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

button.addEventListener("click", sendComment);

// Переход с поля Имя на поле Комментарии при нажатии на Enter
inputName.addEventListener("keyup", (key) => {
  if (key.code === "Enter") {
    key.preventDefault();
    inputText.focus();
  }
});

// После написания текста Enter срабатывал как переход на следующую строку. Добавление события keydown поменяло его использование. Теперь при нажатии Enter публикуется комментарий.
inputText.addEventListener("keydown", (key) => {
  if (key.code === "Enter") {
    key.preventDefault();
    sendComment();
  }
});

inputText.addEventListener("input", switchButton);
inputName.addEventListener("input", switchButton);

// Получение всех комментариев из API
const getComments = () => {
  preloader.classList.add("--ON");
  addForm.classList.remove("--ON");

  getCommentsApi()
    .then((data) => {
        commentsArr = data.comments;
        renderAllComments();
        getEvent();
        preloader.classList.remove("--ON");
        addForm.classList.add("--ON");
      });
};

function sendComment() {
    // проверка на пустые поля и добавление метода trim(), который удаляет пробельные символы с начала и конца строки.
    if (
    inputName.value.trim().length === 0 ||
    inputText.value.trim().length === 0
  ) {
    return;
  }

  preloader.classList.add("--ON");
  addForm.classList.remove("--ON");

  postCommentsApi()
    .then((data) => {
      if (data.result === "ok") {
            getComments();
            inputName.value = "";
            inputText.value = "";
            // Кнопка снова становится неактивной после добавления комментария, т.к. все поля пустые
            switchButton();
      }
    })
    .catch((error) => {
        if (error.message === "500") {
            console.log("Сервер упал");
            return sendComment();
        } else if (error.message === "400") {
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
function switchButton () {
  // Проверка на > 3 так как в другом случае api даст ошибку
  if (
    inputName.value.trim().length !== 0 &&
    inputText.value.trim().length !== 0
  ){
    button.classList.add("active");
    button.classList.remove("inactive");
  } else {
    button.classList.add("inactive");
    button.classList.remove("active");
  }
};

// Удаление последнего комментария...
// document.querySelector('.del-last-comment').addEventListener('click', () => {
//     const indexLast = comments.innerHTML.lastIndexOf('<li class="comment">')
//     comments.innerHTML = comments.innerHTML.slice(0, indexLast);

//     //... в том числе удаление и из массива
//     commentsArr.pop();
    
//     renderAllComments();
// })

getComments();

export { commentsArr, getDate, getEvent };
