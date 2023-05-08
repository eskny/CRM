import { CustomUser } from "./classes.js";

export function getCustomUser(data) {
  const upgradeData = [];
  for (const user of data) {
    let newUser = new CustomUser(user.name, user.surname, user.lastName, user.contacts, user.id, user.createdAt, user.updatedAt)
    upgradeData.push(newUser);
  }
  return upgradeData;
}

export function sortTable(arr, key = 'id', dir = 'asc') {
  const copyArr = [...arr];

  let sortedArr = dir == 'asc'
    ? copyArr.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    })
    : copyArr.sort((a, b) => {
      if (b[key] < a[key]) return -1;
      if (b[key] > a[key]) return 1;
      return 0;
    })
  return sortedArr;
}

export function getDate(str) {
  const year = new Date(str).getFullYear();
  let month = new Date(str).getMonth() + 1;
  const day = new Date(str).getDate();

  if (month < 10) month = `0${month}`;

  return `${day}.${month}.${year}`
}

export function getTime(str) {
  let hours = new Date(str).getHours();
  let minutes = new Date(str).getMinutes();

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;

  return `${hours}:${minutes}`
}

function createPlaceholder(input) {
  input.nextElementSibling.classList.remove('text-field__placeholder--active')
  if (input.value.trim() !== '') {
    input.nextElementSibling.classList.add('text-field__placeholder--active')
  }
}

export function showPlaceholder() {
  const inputs = document.querySelectorAll('.text-field__input');

  inputs.forEach(input => {
    createPlaceholder(input);
    input.addEventListener('input', () => createPlaceholder(input))
  })
}