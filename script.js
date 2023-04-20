const inputName = document.querySelector(".add-form-name");
// const nameInputElement = document.getElementById("name-input");
const inputText = document.querySelector(".add-form-text");
// const commentsInputElement = document.getElementById("comments-input");
const comments = document.querySelector(".comments");
// const listElement = document.getElementById("list");
const button = document.querySelector(".add-form-button");
// const buttonElement = document.getElementById("add-button");

// Добавление массива комментариев
let commentsArr = [];

// Получение всех комментариев из API
const getComments = () => {
    document.querySelector(".preloader").classList.add("--ON");
    
    fetch("https://webdev-hw-api.vercel.app/api/v1/Ivan_Art/comments", {
      method: "GET",
    }).then((response) =>
      response.json().then((data) => {
        commentsArr = data.comments;
        renderAllComments();
        document.querySelector(".preloader").classList.remove("--ON");
      })
    );
  };

// Добавление и формирование даты и времени
const getDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Кликабельность лайка
const eventLike = () => {
    document.querySelectorAll(".like-button").forEach(button => {
        button.addEventListener("click", (event) => {
            // отключение всплытия у события через stopPropagation
            event.stopPropagation();

            commentObj = commentsArr[button.dataset.index];
            if (commentObj.isLiked){
                commentObj.likes -= 1; 
                commentObj.isLiked = false;

            } else {
                commentObj.likes += 1; 
                commentObj.isLiked = true;
            }
        
            renderAllComments();
        })
    });
}

// Редакитрование комментария
const eventEdit = () => {
    document.querySelectorAll(".edit-button").forEach((button, key) => {
        button.addEventListener("click", (event) => {
            // отключение всплытия у события через stopPropagation
            event.stopPropagation();

            commentObj = commentsArr[button.dataset.index];
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
const eventEditInput = () => {
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
    comments.innerHTML = "";
    commentsArr.forEach((comment, index) => 
        renderComment(index, comment.author.name, comment.text, getDate(new Date(comment.date)), comment.isLiked, comment.likes, comment.isEdit));

    eventEdit();
    eventEditInput();
    eventLike();
    eventReply();
};

const sendComment = () => {
    // проверка на пустые поля и добавление метода trim(), который удаляет пробельные символы с начала и конца строки.
    if (inputName.value.trim().length <= 3 || inputText.value.trim().length <= 3) {
        return;
    };

    document.querySelector(".preloader").classList.add("--ON");

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
    })
}).then((response) =>
response.json().then((data) => {
  if (data.result === "ok") {
      getComments();
  }
})
);

    inputName.value = "";
    inputText.value = "";

    // Кнопка снова становится неактивной после добавления комментария, т.к. все поля пустые
    switchButton();
}

button.addEventListener("click", sendComment);

// Переход с поля Имя на поле Комментарии при нажатии на Enter
inputName.addEventListener("keyup", (key) => {
    if(key.code === "Enter") {
        key.preventDefault();
        inputText.focus();
    };
});

// После написания текста Enter срабатывал как переход на следующую строку. Добавление события keydown поменяло его использование. Теперь при нажатии Enter публикуется комментарий.
inputText.addEventListener("keydown", (key) => {
    if(key.code === "Enter") {
        key.preventDefault();
        sendComment();
    };
});

// Если пользователь напишет сообщение, а затем его решит стереть.
const switchButton = () => {
    // Проверка на > 3 так как в другом случае api даст ошибку
    if (inputName.value.trim().length > 3 && inputText.value.trim().length > 3) {
        button.classList.add("active");
        button.classList.remove("inactive");
    } else {
        button.classList.add("inactive");
        button.classList.remove("active");
    }
};

inputText.addEventListener("input", switchButton);
inputName.addEventListener("input", switchButton);

// Удаление последнего комментария...
// document.querySelector('.del-last-comment').addEventListener('click', () => {
//     const indexLast = comments.innerHTML.lastIndexOf('<li class="comment">')
//     comments.innerHTML = comments.innerHTML.slice(0, indexLast);

//     //... в том числе удаление и из массива
//     commentsArr.pop();
    
//     renderAllComments();
// })

getComments();