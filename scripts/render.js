import { getDate, commentsArr } from "./script.js";

const comments = document.querySelector(".comments");
// const listElement = document.getElementById("list");

// Рендеринг комментария
const renderComment = (comment, index) => {
    comments.innerHTML +=  
          `<li class="comment" data-index="${index}">
              <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${getDate(new Date(comment.date))}</div>
              </div>
              <div class="comment-body">
                  ${comment.isEdit 
                      ? `<textArea data-index="${index}" class="input-text">${comment.text}</textArea>` 
                      : `<div class="comment-text">${comment.text}</div>`
                  }
                  <button data-index="${index}" class="edit-button">
                  ${comment.isEdit ? "Сохранить" : "Редактировать"}</button>
              </div>
              <div class="comment-footer">
              <div class="likes">
                  <span class="likes-counter">${comment.likes}</span>
                  <button data-index="${index}" class="like-button 
                  ${comment.isLiked ? "-active-like" : ""}"></button>
              </div>
              </div>
          </li>`;
};

// Old version
// const renderComment = (id, name, text, date, isLiked, likeCounter, isEdit) => {
//     comments.innerHTML +=  
//           `<li class="comment" data-index="${id}">
//               <div class="comment-header">
//               <div>${name}</div>
//               <div>${date}</div>
//               </div>
//               <div class="comment-body">
//                   ${isEdit 
//                       ? `<textArea data-index="${id}" class="input-text">${text}</textArea>` 
//                       : `<div class="comment-text">${text}</div>`
//                   }
//                   <button data-index="${id}" class="edit-button">
//                   ${isEdit ? "Сохранить" : "Редактировать"}</button>
//               </div>
//               <div class="comment-footer">
//               <div class="likes">
//                   <span class="likes-counter">${likeCounter}</span>
//                   <button data-index="${id}" class="like-button 
//                   ${isLiked ? "-active-like" : ""}"></button>
//               </div>
//               </div>
//           </li>`;
//   };

// Отрисовка всех комментариев
export const renderAllComments = () => {
    // перед рендером удаляем все комменты которые были, чтобы они не дублировались
    comments.innerHTML = "";
  
    commentsArr.forEach((comment, index) =>
      renderComment(comment, index)
    );

    // Old version
    // commentsArr.forEach((comment, index) =>
    //     renderComment(
    //     index,
    //     comment.author.name,
    //     comment.text,
    //     getDate(new Date(comment.date)),
    //     comment.isLiked,
    //     comment.likes,
    //     comment.isEdit
    //     )
    // );
};