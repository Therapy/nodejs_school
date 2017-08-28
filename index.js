const MyFormFields = {
  form: document.getElementById('myForm'),
  fio: document.getElementById('fio'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone')
};

form.setAtttibute('novalidate', true);

// todo: переписать на классах
const MyForm = {
  validate() {
    let errorFields = [],
      isValid = true;

    const checkValidity = {
      // ровно три слова
      fio: (MyFormFields.fio.value.trim().split(/\s/).length == 3),
      // RFC 5322 (только для валидации имени почты)
      email: (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(yandex(?:\.(ru|ua|by|kz|com))|(?:ya\.ru))/.test(MyFormFields.email.value)),
      // формат +7(999)999-99-99 и сумма цифр не превышает 30
      phone: (/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(MyFormFields.phone.value) &&
        MyFormFields.phone.value.replace(/\D/g, '')
        .split('')
        .map(val => +val)
        .reduce((acc, val) => acc + val) <= 30),
    };

    for (let key in checkValidity) {
      if (!checkValidity[key]) {
        isValid = false;
        errorFields.push(key);
      }
    }

    return {
      isValid,
      errorFields
    };
  },

  getData() {
    return {
      fio: MyFormFields.fio.value,
      email: MyFormFields.email.value,
      phone: MyFormFields.phone.value
    };
  },

  setData(fields) {
    if (fields) {
      MyFormFields.fio.value = fields.fio;
      MyFormFields.email.value = fields.email;
      MyFormFields.phone.value = fields.phone;
    }
  },

  submit() {

  }
};
