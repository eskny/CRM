export class User {
  constructor(name, surname, lastname, contacts) {
    this.name = name;
    this.surname = surname;
    this.lastName = lastname;
    this.contacts = contacts;
  }
}

export class CustomUser extends User {
  constructor(name, surname, lastname, contacts, id, createdAt, updatedAt) {
    super(name, surname, lastname, contacts);
    this.fullname = `${this.surname} ${this.name} ${this.lastName}`.trim();
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class Contact {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}