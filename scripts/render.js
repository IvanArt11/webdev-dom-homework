import { commentsArr, getDate } from "./script.js";

/*const getDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};*/

// Рендеринг комментария
const renderComment = (comment) => {
  return ` 
          <li class="comment" data-id="${comment.id}">
              <div class="comment-header">
                <div>${comment.author.name}</div>
                <div>${getDate(new Date(comment.date))}</div>
              </div>
              <div class="comment-body">
              <div class="comment-text">${comment.text}</div>
              
              <div class="comment-footer">
              <div class="likes">
                  <span class="likes-counter">${comment.likes}</span>
                  <button" class="like-button ${
                    comment.isLiked ? "-active-like" : ""
                  }"></button>
              </div>
              </div>
          </li>
      `;
};

export const renderAllComments = () => {
  const comments = document.querySelector(".comments");
  comments.innerHTML = "";
  commentsArr.forEach((comment) => {
    comments.innerHTML += renderComment(comment);
  });
};