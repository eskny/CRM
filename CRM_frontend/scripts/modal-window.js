const modal = document.querySelector('.modal');

modal.addEventListener('click', e => {
  if (e.target == modal) {
    hideModal()
  }
})

export function openModal(header, user = null) {
  const modalContent = createModal(header);

  const btnUndo = document.createElement('button');
  btnUndo.classList.add('btn', 'modal-add__btn-undo');

  if (header === 'Удалить клиента') {
    const modalWindow = document.querySelector('.modal-add');
    modalWindow.classList.add('modal-delete');

    const modalWarning = document.createElement('p');
    modalWarning.classList.add('modal__warning');
    modalWarning.textContent = 'Вы действительно хотите удалить данного клиента?'

    const modalBtnDelete = document.createElement('button');
    modalBtnDelete.classList.add('btn', 'btn-modal');
    modalBtnDelete.textContent = 'Удалить'

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-container');

    btnUndo.textContent = 'Отмена';

    modalContent.append(modalWarning, modalBtnDelete, btnUndo);
    modalContent.insertBefore(errorContainer, modalBtnDelete);

    return {
      modalBtnDelete,
      btnUndo
    };
  }

  const modalForm = createModalForm();

  const btnSubmit = modalForm[3];
  const contacts = modalForm.children[3];

  const btnAddContact = document.createElement('button');
  btnAddContact.classList.add('contacts__btn', 'contacts-btn');
  btnAddContact.innerHTML = `<svg class="contacts-btn__plus" width="14" height="14" viewBox="0 0 14 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M6.99998 3.66659C6.63331 3.66659 6.33331 3.96659 6.33331 4.33325V6.33325H4.33331C3.96665 6.33325 3.66665 6.63325 3.66665 6.99992C3.66665 7.36659 3.96665 7.66659 4.33331 7.66659H6.33331V9.66659C6.33331 10.0333 6.63331 10.3333 6.99998 10.3333C7.36665 10.3333 7.66665 10.0333 7.66665 9.66659V7.66659H9.66665C10.0333 7.66659 10.3333 7.36659 10.3333 6.99992C10.3333 6.63325 10.0333 6.33325 9.66665 6.33325H7.66665V4.33325C7.66665 3.96659 7.36665 3.66659 6.99998 3.66659ZM6.99998 0.333252C3.31998 0.333252 0.333313 3.31992 0.333313 6.99992C0.333313 10.6799 3.31998 13.6666 6.99998 13.6666C10.68 13.6666 13.6666 10.6799 13.6666 6.99992C13.6666 3.31992 10.68 0.333252 6.99998 0.333252ZM6.99998 12.3333C4.05998 12.3333 1.66665 9.93992 1.66665 6.99992C1.66665 4.05992 4.05998 1.66659 6.99998 1.66659C9.93998 1.66659 12.3333 4.05992 12.3333 6.99992C12.3333 9.93992 9.93998 12.3333 6.99998 12.3333Z"
                                  fill="#9873FF" />
                              </svg>
                              Добавить контакт`;

  const contactsDiv = document.createElement('div');
  contactsDiv.classList.add('contacts-new');

  contacts.append(contactsDiv, btnAddContact)

  if (header == 'Изменить данные') {
    const clientId = document.createElement('span');
    clientId.classList.add('modal__client-id');
    clientId.textContent = `ID: ${user.id}`;

    btnUndo.textContent = 'Удалить клиента';

    modalForm[0].value = user.surname;
    modalForm[1].value = user.name;
    modalForm[2].value = user.lastName;

    modalContent.append(clientId)

    if (user.contacts) {
      contacts.classList.add('contacts--open')

      user.contacts.forEach(contact => {
        console.log(contact)
        const contactsContainer = createSelectInput(contact);

        contactsDiv.append(contactsContainer)
      })
    }
  } else {
    btnUndo.textContent = 'Отмена';
    btnUndo.addEventListener('click', hideModal)
  }

  btnAddContact.addEventListener('click', function (e) {
    e.preventDefault()
    addContact(this)
  })

  modalContent.append(modalForm, btnUndo)

  return {
    btnSubmit,
    btnUndo,
    modalForm
  }
}

function createModal(header) {
  modal.innerHTML = ''
  modal.classList.add('modal--active')

  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-add');

  const modalHeader = document.createElement('h2');
  modalHeader.classList.add('modal__title', 'title');
  modalHeader.textContent = header;

  const modalContent = document.createElement('div');

  const btnClose = document.createElement('button');
  btnClose.classList.add('modal__btn-close', 'close', 'btn');

  const line = document.createElement('span');
  line.classList.add('close__line');

  btnClose.append(line)
  btnClose.append(line.cloneNode(false));

  btnClose.addEventListener('click', hideModal);

  modalWindow.append(modalHeader, modalContent, btnClose);
  modal.append(modalWindow)

  return modalContent;
}

export function createModalForm() {
  const modalForm = document.createElement('form');

  const modalInputSurname = document.createElement('div');
  modalInputSurname.classList.add('text-field');
  modalInputSurname.innerHTML = `<input class="text-field__input" type="text" id="addSurname" value=""  required>
                                 <label class="text-field__placeholder">Фамилия<span class="violet">*</span></label>`;

  const modalInputName = document.createElement('div');
  modalInputName.classList.add('text-field');
  modalInputName.innerHTML = ` <input class="text-field__input" type="text" id="addName" value="" required>
                                <label class="text-field__placeholder">Имя<span class="violet">*</span></label>
                               `;

  const modalInputLastname = document.createElement('div');
  modalInputLastname.classList.add('text-field');
  modalInputLastname.innerHTML = `<input class="text-field__input" id="addLastName" value="" type="text">
                                <label class="text-field__placeholder">Отчество</label>`;

  const contacts = document.createElement('div');
  contacts.classList.add('contacts');

  const btnSubmit = document.createElement('input');
  btnSubmit.classList.add('btn', 'btn-modal');
  btnSubmit.setAttribute('type', 'submit')
  btnSubmit.value = 'Сохранить';

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('btn-container')

  const errorContainer = document.createElement('div');
  errorContainer.classList.add('error-container');

  btnContainer.append(errorContainer, btnSubmit);

  modalForm.append(modalInputSurname, modalInputName, modalInputLastname, contacts, btnContainer)

  return modalForm
}

export function hideModal() {
  modal.classList.remove('modal--active')
}

function changePlaceholder(mq, input) {
  mq.matches ?
    input.setAttribute('placeholder', 'Введите данные') :
    input.setAttribute('placeholder', 'Введите данные контакта')
}

export function addContact(btn) {
  const contacts = document.querySelector('.contacts');
  contacts.classList.add('contacts--open');

  const contactsDiv = document.querySelector('.contacts-new');

  let { select, inputContact } = createSelect();

  select.innerHTML = `<option>Телефон</option>
  <option>Другое</option>
  <option>Email</option>
  <option>Vk</option>
  <option>Facebook</option>`

  const contactsContainer = document.createElement('div');
  contactsContainer.classList.add('contacts-new__field');
  contactsContainer.append(select, inputContact);

  const btnDeleteContact = document.createElement('button');
  btnDeleteContact.classList.add('contacts-new__delete-btn');
  btnDeleteContact.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                    d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
                                    fill="#B0B0B0" />
                                  </svg>`;

  inputContact.addEventListener('input', function () {
    btnDeleteContact.classList.add('contacts-new__delete-btn--active')
    contactsContainer.append(btnDeleteContact)
  })

  btnDeleteContact.addEventListener('click', function () {
    this.parentElement.remove()
  })

  contactsDiv.append(contactsContainer)

  const selects = document.querySelectorAll('.contacts-new__select');

  selects.forEach(select => {
    const choices = new Choices(select, {
      position: 'bottom',
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
    })
  });

  if (selects.length == 10) {
    btn.classList.add('contacts__btn--hide')
    return
  }
}

function createSelect() {
  let select = document.createElement('select');
  select.classList.add('contacts-new__select');

  let MediaQuery = window.matchMedia('screen and (max-width: 576px)');

  let inputContact = document.createElement('input');
  inputContact.classList.add('contacts-new__input');
  inputContact.setAttribute('placeholder', `${MediaQuery.matches ?
    'Введите данные' :
    'Введите данные контакта'}`);

  MediaQuery.addEventListener('change', e => {
    changePlaceholder(e.target, inputContact)
  })

  return {
    select,
    inputContact
  };
}

const contactTypes = ['Телефон', 'Другое', 'Email', 'Vk', 'Facebook']

function createSelectInput(contact) {
  let { select, inputContact } = createSelect();

  select.innerHTML = `<option>${contact.type}</option>`;

  contactTypes.forEach(contactType => {
    if (contactType != contact.type) select.innerHTML += `<option>${contactType}</option>`
  })

  inputContact.value = contact.value;

  const btnDeleteContact = document.createElement('button');
  btnDeleteContact.classList.add('contacts-new__delete-btn');
  btnDeleteContact.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                    d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
                                    fill="#B0B0B0" />
                                  </svg>`;

  if (contact.value) {
    btnDeleteContact.classList.add('contacts-new__delete-btn--active')
  }

  inputContact.addEventListener('input', function () {
    btnDeleteContact.classList.add('contacts-new__delete-btn--active');
  })

  btnDeleteContact.addEventListener('click', function () {
    this.parentElement.remove()
  })

  const contactsContainer = document.createElement('div');
  contactsContainer.classList.add('contacts-new__field');
  contactsContainer.append(select, inputContact, btnDeleteContact)

  const selects = document.querySelectorAll('.contacts-new__select');

  selects.forEach(select => {
    const choices = new Choices(select, {
      position: 'bottom',
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
    })
  });

  if (selects.length == 10) {
    btn.classList.add('contacts__btn--hide')
    return
  }

  return contactsContainer
}

export function validation(form) {
  const errorContainer = document.querySelector('.error-container');
  errorContainer.innerHTML = '';

  let result = true;

  let inputs = form.querySelectorAll('.text-field__input[required]');

  inputs.forEach(input => {
    if (input.value == '') {
      createError(input, 'Заполните обязательные поля')
      result = false;

      input.addEventListener('input', () => {
        input.classList.remove('error')
      })
    }
  })

  let contactInputs = form.querySelectorAll('.contacts-new__input')

  if (contactInputs.length) {
    contactInputs.forEach(input => {
      if (input.value == '') {
        createError(input, 'Заполните данные контакта')
        result = false;

        input.addEventListener('input', () => {
          input.classList.remove('error')
        })
      }
    })
  }

  return result
}

function createError(input, text) {
  input.classList.add('error')

  const btn = document.querySelector('.btn-modal');
  btn.classList.add('btn-modal--error');

  const btnContainer = document.querySelector('.btn-container');
  const errorContainer = document.querySelector('.error-container');

  const error = document.createElement('label');
  error.classList.add('btn-error');
  error.textContent = text;

  errorContainer.append(error)
  btnContainer.prepend(errorContainer)
}