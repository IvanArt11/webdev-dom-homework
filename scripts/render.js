import { commentsArr } from "./script.js";
import { format } from "date-fns";

// Добавление и формирование даты и времени
const getDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd hh.mm.ss');
};

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