let MyFormFields = {
  form: document.getElementById('myForm'),
  fio: document.getElementById('fio'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  submit: document.getElementById('submitButton')
};

// отключение нативной валидации форм
MyFormFields.form.setAtttibute('novalidate', true);

// todo: переписать на классах
var MyForm = {
  validate() {
    let errorFields = [],
        isValid = true;

    let checkValidity = {
      // ровно три слова
      fio: (MyFormFields.fio.value.trim().split(/\s+/).length == 3),
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
    // в данном случае Object.prototype.toString более корректен нежели typeof
    if (fields && (Object.prototype.toString.call(fields) === '[object Object]')) {
      MyFormFields.fio.value = fields.fio;
      MyFormFields.email.value = fields.email;
      MyFormFields.phone.value = fields.phone;
    }
  },

  submit() {
    let {isValid, errorFields} = this.validate();

    let fields = this.getData();
    Object.keys(fields).forEach(field => fields[field].classList.remove('error'));

    if (isValid) {
      MyFormFields.submit.disabled = true;
      request();
    } else if (errorFields.length) {
      errorFields.forEach(field => MyFormFields[field].classList.add('error'));
    }
  }
};

// todo: переделать под fetch API
function request() {
  let xhr = new XMLHttpRequest();
}
