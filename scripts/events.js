import { commentsArr } from "./script.js";
import { renderAllComments } from "./render.js";
import { postLikeApi } from "./api.js";

// Функция для имитации запросов в API
const delay = (interval = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

// Кликабельность лайка
const eventLike = (comments, token) => {
  comments.forEach((comment) => {
    const button = comment.querySelector(".like-button");
    button.addEventListener("click", (event) => {
      // отключение всплытия у события через stopPropagation
      event.stopPropagation();
      commentsArr.forEach((itemComment) => {
        if (itemComment.id == comment.dataset.id) {
          button.classList.add("-loading-like");
          postLikeApi(itemComment.id, token)
            .then((data) => {
              delay(2000).then(() => {
                itemComment.likes = itemComment.isLiked
                    ? itemComment.likes - 1
                    : itemComment.likes + 1;
                itemComment.isLiked = !itemComment.isLiked;
                itemComment.isLikeLoading = false;

                // itemComment.likes = data.result.likes;
                // itemComment.isLiked = data.result.isLiked;
                renderAllComments();
                getEvent();
              });
            })
            .catch(() => {
              alert("Кажется, у вас сломался интернет, попробуйте позже");
            });
        }
      });
    });
  });
};

// ивент на reply комментария
const eventReply = (comments, inputText) => {
  comments.forEach((comment) => {
    comment.addEventListener("click", () => {
      commentsArr.forEach((itemComment) => {
        if (itemComment.id == comment.dataset.id) {
          let str = itemComment.text;

          // цикл на случай, если будет несколько реплаев
          while (str.indexOf("<div class='quote'>") !== -1) {
            const substr = str.substring(
              0,
              str.indexOf("</div>") + "</div>".length
            );
            str = str.replace(substr, "");
          }
          inputText.value += `QUOTE_BEGIN ${itemComment.author.name}:\n${str} QUOTE_END\n\n`;

          // переносим пользователя в поле ввода текста
          inputText.focus();
        }
      });
    });
  });
};

export function getEvent() {
  const comments = document.querySelectorAll(".comment");
  const inputText = document.querySelector(".add-form-text");
  const login = !localStorage.getItem("login")
    ? {
        login: "",
        password: "",
        token: "",
        name: "",
      }
    : JSON.parse(localStorage.getItem("login"));

  eventLike(comments, login.token);
  eventReply(comments, inputText);
}

/*
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
        getEvent();
      });
    });
};

// Редактирование и запись нового (отредактированного) комментария
const eventEditInput = () => {
    document.querySelectorAll(".input-text").forEach((input) => {
      input.addEventListener("keyup", (key) => {
        const commentObj = commentsArr[input.dataset.index];
        commentObj.text = input.value;
      });
  
      // При клике мыши срабатывает событие reply в случае редактирования 
      input.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });
};
*/