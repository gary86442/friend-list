const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = [];
let filtedUser = [];
const userPerPage = 24;

const dataPanel = document.querySelector("#data-panel");
const search = document.querySelector("#search-input");
const button = document.querySelector(".btn.btn-primary");
const pagination = document.querySelector("#pagination");

function showUsers(datas) {
  let rawHtml = "";
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
  const user = users[id - 1];
  // console.log(button);
  button.innerHTML = `<i class="fa-solid fa-heart " style="cursor: pointer" id=${id}></i>`;

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

function showPagination(datas) {
  let rawHtml = "";
  let pages = Math.ceil(datas.length / userPerPage);
  for (let page = 1; page <= pages; page++) {
    rawHtml += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>`;
  }
  pagination.innerHTML = rawHtml;
}
function datasFilterByPage(page, datas) {
  const startId = (page - 1) * userPerPage + 1;
  const endId = startId + userPerPage;
  return datas.slice(startId, endId);
}

axios
  .get("https://user-list.alphacamp.io/api/v1/users")
  .then((response) => {
    users.push(...response.data.results);
    showUsers(datasFilterByPage(1, users));
    showPagination(users);
    pagination.firstElementChild.classList.add("active");
  })
  .catch((error) => {
    console.log(error);
  });

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
    showUsers(datasFilterByPage(1, users));
    pagination.firstElementChild.classList.add("active");
    return;
  }
  filtedUser = users.filter((user) => {
    const fullName = `${user.name} ${user.surname}`;
    return fullName.toLowerCase().includes(input);
  });
  if (filtedUser.length > 0) {
    showUsers(datasFilterByPage(1, filtedUser));
    showPagination(filtedUser);
    pagination.firstElementChild.classList.add("active");
  } else {
    dataPanel.innerHTML = "find nobody...";
    pagination.innerHTML = "";
  }
});
// 收藏到喜愛清單
button.addEventListener("click", (e) => {
  // 要來確認點擊對象的方式有其他方法?
  const favoriteBTN = e.target.matches(".btn")
    ? e.target.firstElementChild
    : e.target;
  const id = Number(favoriteBTN.id);
  const user = users.find((user) => user.id === id);
  const favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || [];

  if (favoriteList.some((user) => user.id === id)) {
    alert("此人已經在名單中囉！");
    return;
  } else {
    favoriteList.push(user);
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
  }
});

pagination.addEventListener("click", (e) => {
  const activeItem = document.querySelector("#pagination .active");

  if (activeItem) {
    activeItem.classList.remove("active");
  }
  showUsers(datasFilterByPage(e.target.textContent, users));
  e.target.classList.add("active");
});
