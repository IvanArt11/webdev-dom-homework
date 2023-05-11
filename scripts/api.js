const url = "https://webdev-hw-api.vercel.app/api/v2/Ivan_Art";

// Получение всех комментариев из API
const getCommentsApi = (login) => {
  return fetch(url + "/comments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${login.token}`,
    },
  }).then((response) => response.json());
};

const postCommentsApi = (inputText, token) => {
  return fetch(url + "/comments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: inputText
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
      .replaceAll("QUOTE_END", "</div>"),
      /*forceError: true, //Добавлено для появления ошибки 500*/
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw Error("Имя и комментарий должны быть не короче 3 символов" /*"400"*/);
    } else {
      throw Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
  });
};

const postLikeApi = (id, token) => {
  return fetch(`${url}/comments/${id}/toggle-like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
  });
};
export { getCommentsApi, postCommentsApi, postLikeApi };