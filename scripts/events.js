import { commentsArr } from "./script.js";
import { renderAllComments } from "./render.js";

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

            button.classList.add("-loading-like");
  
            delay(2000).then(() => {
            commentObj.likes = commentObj.isLiked
                ? commentObj.likes - 1
                : commentObj.likes + 1;
            commentObj.isLiked = !commentObj.isLiked;
            commentObj.isLikeLoading = false;
            renderAllComments();
            getEvent();
            });
              
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
};
  
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
  
// ивент на reply комментария
const eventReply = () => {
    const inputText = document.querySelector(".add-form-text");
    document.querySelectorAll(".comment").forEach((item) => {
      item.addEventListener("click", () => {
        const commentObj = commentsArr[item.dataset.index];
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

export function getEvent() {
    eventLike();
    eventEdit();
    eventEditInput();
    eventReply();
};
