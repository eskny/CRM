export function navArrow(arr, length) {
  let temp = -1;

  return function (key) {
    if (key.keyCode === 40) {
      arr.forEach(user => user.classList.remove('search__item--active'));
      temp++;

      if (temp >= length) {
        temp = 0;
      }

      arr[temp].classList.add('search__item--active');
    } else if (key.keyCode === 38) {
      arr.forEach(user => user.classList.remove('search__item--active'));
      temp--;

      if (temp < 0) {
        temp = length - 1;
      }

      arr[temp].classList.add('search__item--active');
    } else if (key.keyCode === 13) {
      key.preventDefault();
      arr.forEach(user => {
        if (user.classList.contains('search__item--active')) {
          chooseUser(user.innerText)
        }
      })
    }
  }
}

export function chooseUser(pickUser) {
  const tableData = document.querySelectorAll('.table__body>tr>.table__fullname');
  const searchOptions = document.querySelector('.search__data');
  const search = document.querySelector('.search__input');
  tableData.forEach(user => {
    user.classList.remove('highlight')

    if (user.innerText === pickUser) {
      user.classList.add('highlight')

      user.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      searchOptions.innerHTML = ''
      search.value = ''

      return
    }
  })
}