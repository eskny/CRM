export async function getData(id = null) {
  const response = await fetch(`http://localhost:3000/api/clients/${id ? id : ''}`);
  return await response.json();
}

export async function patchData(user) {
  const response = await fetch(`http://localhost:3000/api/clients/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user),
  });
  return response;
}

export async function postData(user) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })

  return response;
}

export async function searchData(searching) {
  const response = await fetch(`http://localhost:3000/api/clients?search=${searching}`, {
    method: 'GET',
  });
  return await response.json();
}

export async function deleteData(id) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE'
  })

  return response;
}