import { getDate, getTime } from "./helpers.js";
import { renderContacts } from "./contacts.js";

export function createTableData(user) {
  const tableDataId = document.createElement('td');
  tableDataId.classList.add('table__id');

  const idLink = document.createElement('a');
  idLink.textContent = user.id;
  idLink.classList.add('id-link');
  tableDataId.append(idLink);

  idLink.addEventListener('click', function () {
    window.location.hash = `${this.textContent}`;
  })

  const tableDataFullName = document.createElement('td');
  tableDataFullName.classList.add('table__fullname');
  tableDataFullName.textContent = user.fullname;
  tableDataFullName.setAttribute('id', `${user.fullname}`)

  const tableDataCreateDate = document.createElement('td');
  tableDataCreateDate.classList.add('table__date-data')
  const createTag = document.createElement('time');
  createTag.setAttribute('datetime', user.createdAt);
  createTag.classList.add('table__date');
  const createSpan = document.createElement('span');
  createSpan.classList.add('table__time');
  const dateCreate = getDate(user.createdAt)
  const timeCreate = getTime(user.createdAt)
  createTag.textContent = dateCreate;
  createSpan.textContent = timeCreate;
  createTag.append(createSpan);
  tableDataCreateDate.append(createTag)

  const tableDataUpdateDate = document.createElement('td');
  tableDataUpdateDate.classList.add('table__date-data')
  const date = getDate(user.updatedAt)
  const time = getTime(user.updatedAt)
  const dateTag = document.createElement('time');
  dateTag.setAttribute('datetime', user.updatedAt);
  dateTag.classList.add('table__date');
  const timeSpan = document.createElement('span');
  timeSpan.classList.add('table__time');
  dateTag.textContent = date;
  timeSpan.textContent = time;
  dateTag.append(timeSpan);
  tableDataUpdateDate.append(dateTag)

  const tableDataContacts = document.createElement('td');
  tableDataContacts.classList.add('table__contacts');

  if (user.contacts.length) {
    user.contacts.forEach(contact => {
      const icon = renderContacts(contact);
      tableDataContacts.append(icon);
    });
  }

  const btnEdit = document.createElement('button');
  btnEdit.classList.add('btn', 'btn-edit');
  btnEdit.innerHTML = `<svg class="icon-edit" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M0 10.5V13H2.5L9.87333 5.62662L7.37333 3.12662L0 10.5ZM11.8067 3.69329C12.0667 3.43329 12.0667 3.01329 11.8067 2.75329L10.2467 1.19329C9.98667 0.933291 9.56667 0.933291 9.30667 1.19329L8.08667 2.41329L10.5867 4.91329L11.8067 3.69329Z" fill="#9873FF"/>
                         </svg>
                        Изменить`

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn', 'btn-delete');
  btnDelete.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
                            </svg>
                          Удалить
                        `
  const tableDataActions = document.createElement('td');
  tableDataActions.append(btnEdit, btnDelete)
  tableDataActions.classList.add('table__actions');

  return {
    tableDataId,
    tableDataFullName,
    tableDataCreateDate,
    tableDataUpdateDate,
    tableDataContacts,
    tableDataActions,
    btnEdit,
    btnDelete
  }
}