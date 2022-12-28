const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = JSON.parse(localStorage.getItem("favoriteList"));
let filtedUser = [];

const dataPanel = document.querySelector("#data-panel");
const search = document.querySelector("#search-input");
const button = document.querySelector(".btn.btn-primary");

function showUsers(datas) {
  let rawHtml = "";
  if (datas.length < 1) {
    rawHtml = "There are no favorites yet...";
  }
  datas.forEach((user) => {
    rawHtml += `<div class="col-sm-2 mb-2">
          <div class="card">
            <img
              src="${user.avatar}"
              class="card-img-top"
              alt="avatar"
              data-bs-toggle="modal"
              data-bs-target="#user-modal"
              data-id ="${user.id}"
            />
            <div class="card-body">
              <p class="card-text fw-bold" style="font-size:18px " id="user-name">${user.name} <br>${user.surname}</br></p>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHtml;
}

function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalAvatar = document.querySelector("#user-modal-avatar");
  const modalInfo = document.querySelector("#user-modal-info");
  const user = users.find((user) => user.id === id);
  // console.log(button);
  button.innerHTML = `<i class="fa-solid fa-heart-crack " style="cursor: pointer" id=${id}></i>`;

  modalName.innerText = `${user.name} ${user.surname}`;
  modalAvatar.innerHTML = `<img
                    style="height: 400px"
                    class="img-fluid rounded mx-auto d-block"
                    src="${user.avatar}"
                    alt="avatar"
                    data-id = "${id}"
                  />`;

  modalInfo.innerHTML = `<p>Gender:${user.gender}</p>
                  <p>Age:${user.age}</p>
                  <p>Region:${user.region}</p>
                  <p>Birthday:${user.birthday}</p>
                  <p>Email:${user.email}</p>`;
}

showUsers(users);

dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".card-img-top")) {
    const id = Number(event.target.dataset.id);

    showUserModal(id);
  }
});
// 搜尋名字功能
search.addEventListener("keyup", (event) => {
  const input = event.target.value.toLowerCase().trim();
  if (!input) {
    showUsers(users);
    return;
  }
  filtedUser = users.filter((user) => {
    const fullName = `${user.name} ${user.surname}`;
    return fullName.toLowerCase().includes(input);
  });
  if (filtedUser.length > 0) {
    showUsers(filtedUser);
  } else {
    dataPanel.innerHTML = "find nobody...";
  }
});

//喜歡監聽事件
button.addEventListener("click", (e) => {
  // 要來確認點擊對象的方式有其他方法?
  const delFavoriteBTN = e.target.matches(".btn")
    ? e.target.firstElementChild
    : e.target;
  const id = Number(delFavoriteBTN.id);

  const delUserIndex = users.findIndex((user) => user.id === id);
  if (delUserIndex === -1) {
    alert("此人已經不在喜愛名單中!");
    return;
  }
  users.splice(delUserIndex, 1);
  localStorage.setItem("favoriteList", JSON.stringify(users));
  showUsers(users);
});
