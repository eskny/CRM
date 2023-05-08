import { getData, patchData, deleteData, searchData, postData } from "./data.js";
import { getCustomUser, sortTable, showPlaceholder } from "./helpers.js";
import { createTableData } from "./table-data.js";
import { openModal, validation, hideModal } from "./modal-window.js";
import { CustomUser, Contact, User } from "./classes.js";
import { navArrow, chooseUser } from "./search.js";

export function init() {
  // получение данных, сортировка и отрисовывание таблицы
  updateTable();

  const btnAddUser = document.querySelector('.btn-add');
  // открытие модального окна по кнопке "Добавить клиента"
  btnAddUser.addEventListener('click', () => {
    const { btnSubmit, btnUndo, modalForm } = openModal('Новый клиент');
    showPlaceholder();

    // если прошла валидация, добавление пользователя в таблицу
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      if (validation(modalForm)) {
        saveUserData()
      }
    })
  })

  const tableId = document.querySelector('.table-head__id'),
    tableFIO = document.querySelector('.table-head__fullname'),
    tableCreateDate = document.querySelector('.table-head__created'),
    tableUpdateDate = document.querySelector('.table-head__updated');

  const tableHeads = [tableId, tableFIO, tableCreateDate, tableUpdateDate];

  // сортировка по заголовку
  tableHeads.forEach(item => {
    item.addEventListener('click', async function (e) {
      let key = this.dataset.head;
      let attr = this.getAttribute('data-dir')

      sortData(key, attr, e.currentTarget)
    })
  })

  // по нажатию на ссылку id меняется хэш и открывается модальное окна для редактирования пользователя
  window.addEventListener('hashchange', async function () {
    let hash = location.hash;
    const userData = await getData(hash.substring(1));
    editUserData(userData.id)
  });

  const logo = document.querySelector('.logo');
  const search = document.querySelector('.search');

  // появление инпута для поиска на маленьких разрешения экрана по клику на лого
  logo.addEventListener('click', () => {
    search.classList.add('search--active');
    logo.classList.add('logo--active');
  });
}

async function updateTable(key = 'id') {
  const spinner = document.querySelector('.spinner');
  spinner.classList.remove('spinner--stop');

  // получение и подготовка данных
  const data = await getData();
  const upgradedData = getCustomUser(data);
  let sortedData = sortTable(upgradedData, key);

  spinner.classList.add('spinner--stop');

  // отрисовка таблицы
  renderTable(sortedData);
}

function renderTable(arr) {
  const tableBody = document.querySelector('.table__body');
  tableBody.innerHTML = ''
  let copyArr = [...arr];

  // добавление пользователей в таблицу
  for (const user of copyArr) {
    tableBody.append(addUser(user))
  }

  const search = document.querySelector('.search__input');

  search.addEventListener('input', function () {
    let timer;
    clearTimeout(timer);

    // поиск с задержкой 300мс
    timer = setTimeout(async () => {
      // появление дропдауна для поиска
      await showOptions(this.value)

      const searchOptions = document.querySelector('.search__data');

      let findedUsers = Array.from(searchOptions.children);
      let length = findedUsers.length;

      const arrow = navArrow(findedUsers, length);

      //навигация по дропдауну
      this.addEventListener('keydown', (key) => {
        arrow(key)
      })

      // скролл до выбранного пользователя
      findedUsers.forEach(user => {
        user.addEventListener('click', (event) => {
          event.preventDefault();
          chooseUser(event.target.innerText)
        })
      })
    }, 300)
  })

  let userLinks = document.querySelectorAll('.id-link');

  // по нажатию на ссылку id открывается модальное окна для редактирования пользователя
  userLinks.forEach(link => {
    link.addEventListener('click', function () {
      editUserData(this.textContent)
    })
  })
}

function addUser(user) {
  const tableRow = document.createElement('tr');
  tableRow.classList.add('table__row')

  // создание строки таблицы с данными пользователя
  const {
    tableDataId,
    tableDataFullName,
    tableDataCreateDate,
    tableDataUpdateDate,
    tableDataContacts,
    tableDataActions,
    btnEdit,
    btnDelete
  } = createTableData(user);

  // открытие модального окна для изменения сущ-го пользователя
  btnEdit.addEventListener('click', function () {
    editUserData(user.id, this)
  })

  // открытие МО для удаления сущ-го пользователя
  btnDelete.addEventListener('click', function () {
    deleteUserData(user.id);
  })

  tableRow.append(tableDataId,
    tableDataFullName,
    tableDataCreateDate,
    tableDataUpdateDate,
    tableDataContacts,
    tableDataActions);

  return tableRow;
}

async function editUserData(id, btn = null) {
  const spinnerEdit = document.createElement('span');

  //по нажатию на кнопку изменить анимация загрузки(спиннер)
  if (btn) {
    spinnerEdit.classList.add('spinner-edit-container');
    spinnerEdit.innerHTML = `<svg class="spinner" width="12" height="12" viewBox="2 2 16 16" fill="none">
      <circle class="path spinner-edit" cx="10" cy="10" r="6" fill="none" stroke="#9873FF" stroke-width="1.5"></circle>
                                </svg>`

    btn.prepend(spinnerEdit)
  }

  // получение данных о пользователе
  const userData = await getData(id);

  // открытие МО для изменения данного пользователя
  const {
    btnSubmit,
    btnUndo,
    modalForm
  } = openModal('Изменить данные', userData);

  // конец анимации загрузки
  spinnerEdit.remove();

  // сохранение измененных данных после валидации
  btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    if (validation(modalForm)) {
      saveChangedData(id)
    }
  })

  // отмена изменения
  btnUndo.addEventListener('click', () => {
    deleteUserData(id)
  })

  const inputs = document.querySelectorAll('.text-field__input');

  inputs.forEach(input => {
    showPlaceholder(input);
    input.addEventListener('input', () => showPlaceholder(input))
  })
  const selects = document.querySelectorAll('.contacts-new__select')

  selects.forEach(item => {
    const choices = new Choices(item, {
      position: 'bottom',
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
    })
  })
}

async function saveChangedData(id) {
  const contactTypes = document.querySelectorAll('.contacts-new__select');
  const contactValues = document.querySelectorAll('.contacts-new__input');

  let contacts = [];
  let userChanged = {};

  // добавление новых контактов
  for (let i = 0; i < contactTypes.length; i++) {
    contacts.push({
      type: contactTypes[i].value,
      value: contactValues[i].value,
    })

    // запрещение изменения данных после нажатия на кнопку сохранить
    contactTypes[i].disabled = true;
    contactValues[i].disabled = true;
  }

  const surnameInput = document.getElementById('addSurname');
  const nameInput = document.getElementById('addName');
  const lastnameInput = document.getElementById('addLastName');

  userChanged.name = nameInput.value;
  userChanged.surname = surnameInput.value;
  userChanged.lastName = lastnameInput.value;
  userChanged.contacts = contacts;
  userChanged.id = id;

  // завпрещение изменения данных после нажатия на кнопку сохранить
  surnameInput.disabled = true;
  nameInput.disabled = true;
  lastnameInput.disabled = true;

  // отправка измененных данных на сервер
  const response = await patchData(userChanged);

  // завершение операции или отображение ошибки
  completeOperation(response.status);
}

async function saveUserData() {
  let contacts = [];
  let contactTypes = document.querySelectorAll('.contacts-new__select');
  let contactValues = document.querySelectorAll('.contacts-new__input');

  // сохранение контактов, если есть
  if (contactValues) {
    contactValues.forEach((elem, i) => {
      let type = contactTypes[i].value;
      let val = contactValues[i].value;

      let contact = new Contact(type, val);
      contacts.push(contact)
    })
  }

  const name = document.getElementById('addName');
  const surname = document.getElementById('addSurname');
  const lastname = document.getElementById('addLastName');

  const user = new User(name.value.trim(), surname.value.trim(), lastname.value.trim(), contacts);

  // отправка нового пользователя на сервер
  const response = await postData(user);

  // завершение операции или отображение ошибки
  completeOperation(response.status);
}

function deleteUserData(id) {
  // открытие МО для удаление клиента
  const {
    modalBtnDelete,
    btnUndo
  } = openModal('Удалить клиента');

  // подтверждение удаления
  modalBtnDelete.addEventListener('click', async function () {
    const response = await deleteData(id);

    console.log(response)

    completeOperation(response.status);
  })

  // отмена удаления
  btnUndo.addEventListener('click', function () {
    hideModal();
  })
}

function completeOperation(status) {
  // если статус ОК, закрыть МО, перерисовать таблицу
  if (status < 400) {
    hideModal()
    updateTable();
  } else { // иначе вывести сообщение об ошибке
    if (status >= 400) {
      const btn = document.querySelector('.btn-modal');
      btn.classList.add('btn-modal--error');
      btn.setAttribute('error', `${status === 422 ? status + ': Unprocessable Entity' :
        status === 404 ? status + ': Not Found' :
          status >= 500 ? status + ': Ошибка сервера' :
            'Что-то пошло не так...'}`)

      const errorContainer = document.querySelector('.error-container');
      errorContainer.innerHTML = ''

      const error = document.createElement('label');
      error.classList.add('btn-error');
      error.textContent = btn.getAttribute('error');

      errorContainer.append(error)
    }
  }
}

async function showOptions(value) {
  const spinner = document.querySelector('.spinner');
  spinner.classList.remove('spinner--stop');

  // поиск данных на сервере
  const searchingData = await searchData(value);
  const searchingDataNew = [];

  // найденные данные по запросу поиска
  for (const user of searchingData) {
    let findedUser = new CustomUser(user.name, user.surname, user.lastName, user.contacts, user.id, user.createdAt, user.updatedAt)
    searchingDataNew.push(findedUser);
  }

  const htmlOption = searchingDataNew.map((user, index) => `<li href="#${user.fullname}" class="search__item" data-number="${index}">${user.fullname}</li>`).join('');

  const searchOptions = document.querySelector('.search__data');

  spinner.classList.add('spinner--stop');

  // отображение найденных данных в дропдауне
  searchOptions.innerHTML = value ? htmlOption : null;
}

async function sortData(key, attr, target) {
  const spinner = document.querySelector('.spinner');
  spinner.classList.remove('spinner--stop');

  // подготовка данных
  const data = await getData();
  const upgradedData = getCustomUser(data);
  let sortedData = sortTable(upgradedData)

  // изменение направление сортировки
  if (attr == 'desc') {
    sortedData = sortTable(upgradedData, key, 'desc');
    target.dataset.dir = 'asc';
    target.children[0].classList.remove('arrow--up')
  } else {
    sortedData = sortTable(upgradedData, key, 'asc');
    target.dataset.dir = 'desc';
    target.children[0].classList.add('arrow--up');
  }
  // отрисовка таблицы
  renderTable(sortedData);
  spinner.classList.add('spinner--stop');
}