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

// Кликабельность лайка
const eventLike = () => {
  document.querySelectorAll(".like-button").forEach(button => {
      button.addEventListener("click", (event) => {
          // отключение всплытия у события через stopPropagation
          event.stopPropagation();

          const commentObj = commentsArr[button.dataset.index];
          
          // Функция для имитации запросов в API
          function delay(interval = 300) {
              return new Promise((resolve) => {
              setTimeout(() => {
                  resolve();
              }, interval);
              });
          };

          delay(2000).then(() => {
          commentObj.likes = commentObj.isLiked
              ? commentObj.likes - 1
              : commentObj.likes + 1;
          commentObj.isLiked = !commentObj.isLiked;
          commentObj.isLikeLoading = false;
          renderAllComments();
          });

          button.classList.add('-loading-like');
          
          // if (commentObj.isLiked){
          //     commentObj.likes -= 1; 
          //     commentObj.isLiked = false;

          // } else {
          //     commentObj.likes += 1; 
          //     commentObj.isLiked = true;
          // }
      
          // renderAllComments();
        })
  });
}

// Редакитрование комментария
const eventEdit = () => {
  document.querySelectorAll(".edit-button").forEach((button, key) => {
    button.addEventListener("click", (event) => {
      // отключение всплытия у события через stopPropagation
      event.stopPropagation();

      const commentObj = commentsArr[button.dataset.index];
      if (commentObj.isEdit) {
        // Исключаем возможность сохранения комментария без текста 
        if (commentObj.text.trim() === "") return; 
        button.innerHTML = "Редактировать";
        commentObj.isEdit = false;
      } else {
        button.innerHTML = "Сохранить";
        commentObj.isEdit = true;
      }
      renderAllComments();
    });
  });
};

// ивент на reply комментария
const eventReply = () => {
  document.querySelectorAll(".comment").forEach((item) => {
    item.addEventListener("click", () => {
      commentObj = commentsArr[item.dataset.index];
      let str = commentObj.text;

      while (str.indexOf("<div class='quote'>") !== -1) { 
        const substr = str.substring(0, str.indexOf("</div>") + "</div>".length);
        str = str.replace(substr, "");
      }

      inputText.value += `QUOTE_BEGIN ${commentObj.author.name}:\n${str} QUOTE_END\n\n`;

      // переносим пользователя в поле ввода текста
      inputText.focus();
    });
  });
};

// Редактирование и запись нового (отредактированного) комментария
const evenEditInput = () => {
  document.querySelectorAll(".input-text").forEach((input) => {
    input.addEventListener("keyup", (key) => {
      commentObj = commentsArr[input.dataset.index];
      commentObj.text = input.value;
    });

    // При клике мыши срабатывает событие reply в случае редактирования 
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });
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

  fetch("https://webdev-hw-api.vercel.app/api/v1/Ivan_Art/comments", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
        commentsArr = data.comments;
        renderAllComments();
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

  fetch("https://webdev-hw-api.vercel.app/api/v1/Ivan_Art/comments", {
    method: "POST",
    body: JSON.stringify({
      name: inputName.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      text: inputText.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>"),
        forceError: true, //Добавлено для появления ошибки 500
    })
  })
    .then((response) => {
    if (response.status === 201) {
        return response.json();
    } else if (response.status === 400) {
        throw new Error("400");
        // return Promise.reject("Имя и комментарий должны быть не короче 3 символов")
    } else if (response.status === 500) {
        throw new Error("500");
        // return Promise.reject("Сервер упал")
    } else {
        throw new Error("Неполадки с интернетом");
        // return Promise.reject("Неполадки с интернетом")
    }
    })
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

// Рендеринг комментария
const renderComment = (id, name, text, date, isLiked, likeCounter, isEdit) => {
  comments.innerHTML +=  
        `<li class="comment" data-index="${id}">
            <div class="comment-header">
            <div>${name}</div>
            <div>${date}</div>
            </div>
            <div class="comment-body">
                ${isEdit 
                    ? `<textArea data-index="${id}" class="input-text">${text}</textArea>` 
                    : `<div class="comment-text">${text}</div>`
                }
                <button data-index="${id}" class="edit-button">
                ${isEdit ? "Сохранить" : "Редактировать"}</button>
            </div>
            <div class="comment-footer">
            <div class="likes">
                <span class="likes-counter">${likeCounter}</span>
                <button data-index="${id}" class="like-button 
                ${isLiked ? "-active-like" : ""}"></button>
            </div>
            </div>
        </li>`;
};

// Отрисовка всех комментариев
const renderAllComments = () => {
  // перед рендером удаляем все комменты которые были, чтобы они не дублировались
  comments.innerHTML = "";

  commentsArr.forEach((comment, index) =>
    renderComment(
      index,
      comment.author.name,
      comment.text,
      getDate(new Date(comment.date)),
      comment.isLiked,
      comment.likes,
      comment.isEdit
    )
  );

  // заново добавляем евенты на все кнопки, чтобы евент попал на новый коммент с кнопкой
  eventLike();
  eventEdit();
  evenEditInput();
  eventReply();
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

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
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