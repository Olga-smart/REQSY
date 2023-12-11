"use strict";

/* Img Uploader */
class ImageUploader {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._input = component.querySelector('.js-img-uploader__input');
    this._imageArea = component.querySelector('.js-img-uploader__img-area');
    this._button = component.querySelector('.js-img-uploader__button');
  }

  _handleButtonClick() {
    this._input.click();
  }

  _handleInputChange() {
    const reader = new FileReader();
    reader.onload = () => {
      const prevImage = this._imageArea.querySelector('.js-img-uploader__img');
      if (prevImage) {
        prevImage.remove();
      }
      const img = document.createElement('img');
      img.src = reader.result;
      img.className = 'img-uploader__img js-img-uploader__img';
      img.alt = 'Фото профиля';
      this._imageArea.append(img);
    };

    const image = this._input.files[0];
    if (image) {
      reader.readAsDataURL(image);
    }    
  }

  _attachEventHandlers() {
    this._button.addEventListener('click', this._handleButtonClick.bind(this));
    this._input.addEventListener('change', this._handleInputChange.bind(this));
  }
}

const imageUploaders = document.querySelectorAll('.js-img-uploader');
if (imageUploaders) {
  imageUploaders.forEach((uploader) => {
    new ImageUploader(uploader);
  });
}
/* End Img Uploader */

/* Phone Mask */
const telInputs = document.querySelectorAll('.js-input_phone');
if (telInputs) {
  telInputs.forEach((input) => {
    const mask = IMask(input, {
      mask: '+{7}({9}00)000-00-00',
    });

    input.addEventListener('focus', () => {
      mask.updateOptions({
        lazy: false,
      });
    })

    input.addEventListener('blur', () => {
      mask.updateOptions({
        lazy: true,
      });
    })
  });
}
/* End Phone Mask */

/* Registration Form */
class RegistrationForm {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._name = component.querySelector('.js-registration-form__name');
    this._surname = component.querySelector('.js-registration-form__surname');
    this._phone = component.querySelector('.js-registration-form__phone');
    this._mail = component.querySelector('.js-registration-form__mail');
    this._agreement = component.querySelector('.js-registration-form__agreement');
    this._successModal = document.querySelector('.js-registration-modal');
  }

  _handleSubmit(event) {
    const formIsValid = this._validate();

    if (!formIsValid) {
      event.preventDefault();
    } else {
      event.preventDefault();
      this._successModal.classList.add('modal_opened');
    }
  }

  _validate() {
    let formIsValid = true;

    const nameValue = this._name.value.trim();
    if (nameValue === '') {
      formIsValid = false;
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (!this._containsOnlyCyrillic(nameValue)) {
      formIsValid = false;
      this._setErrorFor(this._name, 'Некорректные символы. Используйте только кириллицу');
    } else if (nameValue.length < 2) {
      formIsValid = false;
      this._setErrorFor(this._name, 'Слишком мало символов');
    } else {
      this._removeErrorFor(this._name);
    }

    const surnameValue = this._surname.value.trim();
    if (surnameValue === '') {
      formIsValid = false;
      this._setErrorFor(this._surname, 'Поле обязательно для заполнения');
    } else if (!this._containsOnlyCyrillic(surnameValue)) {
      formIsValid = false;
      this._setErrorFor(this._surname, 'Некорректные символы. Используйте только кириллицу');
    } else if (surnameValue.length < 2) {
      formIsValid = false;
      this._setErrorFor(this._surname, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._surname);
    }

    const phoneValue = this._phone.value.trim();
    if (phoneValue === '') {
      formIsValid = false;
      this._setErrorFor(this._phone, 'Поле обязательно для заполнения');
    } else if (phoneValue.length !== 16) {
      formIsValid = false;
      this._setErrorFor(this._phone, 'Введите правильный телефон');
    } else {
      this._removeErrorFor(this._phone);
    }

    const mailValue = this._mail.value.trim();
    if (mailValue === '') {
      formIsValid = false;
      this._setErrorFor(this._mail, 'Поле обязательно для заполнения');
    } else if (!this._isEmail(mailValue)) {
      formIsValid = false;
      this._setErrorFor(this._mail, 'Введите правильный email');
    } else {
      this._removeErrorFor(this._mail);
    }

    const agreementIsAccepted = this._agreement.checked;
    if (!agreementIsAccepted) {
      formIsValid = false;
      this._setErrorFor(this._agreement, 'Нужно принять соглашение');
    } else {
      this._removeErrorFor(this._agreement);
    }

    return formIsValid;
  }

  _containsOnlyCyrillic(string) {
    return /[а-яА-ЯЁё]/.test(string);
  } 

  _isEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  _setErrorFor(input, message) {
    const formControl = input.closest('.js-form-control');

    const previousErrorMessage = formControl.querySelector('.form-control__error-message');
    if (previousErrorMessage) {
      previousErrorMessage.remove();
    }
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-control__error-message';
    errorMessage.textContent = message;
    
    formControl.append(errorMessage);
    formControl.classList.add('form-control_error');
  }

  _removeErrorFor(input) {
    const formControl = input.closest('.js-form-control');
    const errorMessage = formControl.querySelector('.form-control__error-message');
    if (errorMessage) {
      errorMessage.remove();
      formControl.classList.remove('form-control_error');
    }
  }

  _attachEventHandlers() {
    this._component.addEventListener('submit', this._handleSubmit.bind(this));
  }
}

const registrationForm = document.querySelector('.js-registration-form');
if (registrationForm) {
  new RegistrationForm(registrationForm);
}
/* End Registration Form */

/* Modal */
class Modal {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  close() {
    this._component.classList.remove('modal_opened');
  }

  open() {
    this._component.classList.add('modal_opened');
  }

  _initFields(component) {
    this._component = component;
    this._closeButton = component.querySelector('.js-modal__close-button');
  }

  _handleClick(event) {
    const target = event.target;

    if (target.closest('.js-modal__close-button') || !target.closest('.js-modal__window')) {
      this.close();
    }
  }

  _attachEventHandlers() {
    this._component.addEventListener('click', this._handleClick.bind(this));
  }
}

const modals = document.querySelectorAll('.js-modal');
if (modals) {
  modals.forEach((modal) => {
    new Modal(modal);
  });
}
/* End Modal */
