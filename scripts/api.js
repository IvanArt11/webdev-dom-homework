// Получение всех комментариев из API
const getCommentsApi = () => {
  
    return fetch("https://webdev-hw-api.vercel.app/api/v1/Ivan_Art/comments", {
      method: "GET",
    })
    .then((response) => response.json())
};
  
const postCommentsApi = () => {
    const inputName = document.querySelector(".add-form-name");
    const inputText = document.querySelector(".add-form-text");
  
    return fetch("https://webdev-hw-api.vercel.app/api/v1/Ivan_Art/comments", {
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
};

export { getCommentsApi, postCommentsApi };
