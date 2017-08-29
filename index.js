let Fields = {
  form: document.getElementById('myForm'),
  fio: document.querySelector('input[name=fio]'),
  email: document.querySelector('input[name=email]'),
  phone: document.querySelector('input[name=phone]'),
  submit: document.getElementById('submitButton')
};

const container = document.getElementById('resultContainer');

// var для выполнения условия с глобальной областью видимости
var MyForm = {
  validate() {
    let errorFields = [],
        isValid = true;

    let checkValidity = {
      // ровно три слова
      fio: (Fields.fio.value.trim().split(/\s+/).length == 3),
      // RFC 5322 (только для валидации имени почты)
      email: (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(yandex(?:\.(ru|ua|by|kz|com))|(?:ya\.ru))/.test(Fields.email.value)),
      // формат +7(999)999-99-99 и сумма цифр не превышает 30
      phone: (/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(Fields.phone.value) &&
        Fields.phone.value.replace(/\D/g, '')
                          .split('')
                          .reduce((acc, val) => acc + +val, 0) <= 30), // parseInt(val);
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
      fio: Fields.fio.value,
      email: Fields.email.value,
      phone: Fields.phone.value
    };
  },

  setData(fields) {
    // в данном случае Object.prototype.toString более корректен нежели typeof
    if (fields && (Object.prototype.toString.call(fields) === '[object Object]')) {
      Fields.fio.value = fields.fio;
      Fields.email.value = fields.email;
      Fields.phone.value = fields.phone;
    } else {
      return 'Неверный формат!';
    }
    return;
  },

  submit() {
    let {isValid, errorFields} = this.validate();

    let fields = this.getData();
    Object.keys(fields).forEach(field => Fields[field].classList.remove('error'));

    if (isValid) {
      Fields.submit.disabled = true;
      fetchRequest();
    } else {
      errorFields.forEach(field => Fields[field].classList.add('error'));
    }
  }
};

function getRandomURL() {
  let random = Math.floor(Math.random() * 3);

  switch (random) {
    case 0:
      return '/error.json';
    case 1:
      return '/success.json';
    case 2:
      return '/progress.json';
  }
}

function fetchRequest() {
  container.classList.remove('error', 'success', 'progress');
  const url = getRandomURL();

  return  fetch(Fields.form.action + url)
          .then(res => res.json())
          .then(data => {
            // для проверки ответов от сервера и обновления стилей
            // Fields.submit.disabled = false;
            switch (data.status) {
              case 'error':
                container.classList.add('error');
                container.innerText = data.reason || 'Произошла ошибка на сервере!';
                break;
              case 'success':
                container.classList.add('success');
                container.innerText = 'Успешно!';
                break;
              case 'progress':
                container.classList.add('progress');
                container.innerText = 'Подождите, идет загрузка!';
                setTimeout(() => fetchRequest(), data.timeout);
                break;
            }
          })
          .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
  Fields.form.onsubmit = (e) => {
    e.preventDefault();
    MyForm.submit();
  };
});
