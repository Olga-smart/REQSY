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
    const { target } = event;

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

/* Select */
class Select {
  constructor(component) {
    this._initFields(component);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._attachEventHandlers();
  }

  toggle() {
    this._component.classList.toggle('select_opened');

    if (this._component.classList.contains('select_opened')) {
      this._input.placeholder = 'Выберите форму организации';
      window.addEventListener('click', this._handleOutsideClick);
    }

    if (!this._component.classList.contains('select_opened')) {
      this._input.placeholder = 'Не выбрано';
      window.removeEventListener('click', this._handleOutsideClick);
    }
  } 

  _initFields(component) {
    this._component = component;
    this._input = component.querySelector('.js-select__input');
    this._items = component.querySelectorAll('.js-select__item');
  }

  _handleInputClick() {
    this.toggle();
  }

  _handleItemClick(item) {
    this._items.forEach((item) => {
      item.classList.remove('select__item_selected');
    });

    item.classList.add('select__item_selected');
    this._input.value = item.textContent;
    this._input.dispatchEvent(new Event('change'));
    this.toggle();
  }

  _handleOutsideClick(event) {
    const { target } = event;
    const clickOnSelect = this._component.contains(target);

    if (!clickOnSelect) {
      this.toggle();
    }
  }

  _attachEventHandlers() {
    this._input.addEventListener('click', this._handleInputClick.bind(this));

    this._items.forEach((item) => {
      item.addEventListener('click', this._handleItemClick.bind(this, item));
    })
  }
}

const selects = document.querySelectorAll('.js-select');
if (selects) {
  selects.forEach((select) => {
    new Select(select);
  });
}
/* End Select */

/* Company Creation Form */
class CompanyCreationForm {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._orgForm = component.querySelector('.js-company-creation-form__org-form');
    this._name = component.querySelector('.js-company-creation-form__name');
    this._taxNumber = component.querySelector('.js-company-creation-form__tax-number');
    this._address =component.querySelector('.js-company-creation-form__address');
    this._agreement = component.querySelector('.js-company-creation-form__agreement');
  }

  _handleSubmit(event) {
    const formIsValid = this._validate();

    if (!formIsValid) {
      event.preventDefault();
    }
  }

  _handleOrgFormChange() {
    if (this._orgForm.value == 'Физическое лицо') {
      this._taxNumber.closest('.js-form-control').style.display = 'none';
      this._address.closest('.js-form-control').style.display = 'none';
    } else {
      this._taxNumber.closest('.js-form-control').style.display = 'block';
      this._address.closest('.js-form-control').style.display = 'block';
    }
  }

  _validate() {
    let formIsValid = true;

    const orgFormValue = this._orgForm.value.trim();
    if (orgFormValue === '') {
      formIsValid = false;
      this._setErrorFor(this._orgForm, 'Выберите форму организации');
    } else {
      this._removeErrorFor(this._orgForm);
    }

    const nameValue = this._name.value.trim();
    if (nameValue === '') {
      formIsValid = false;
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (nameValue.length < 2) {
      formIsValid = false;
      this._setErrorFor(this._name, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._name);
    }

    if (orgFormValue === 'Юридическое лицо') {
      const taxNumberValue = this._taxNumber.value.trim();
      if (taxNumberValue === '') {
        formIsValid = false;
        this._setErrorFor(this._taxNumber, 'Поле обязательно для заполнения');
      } else if (!this._isTaxNumber(taxNumberValue)) {
        formIsValid = false;
        this._setErrorFor(this._taxNumber, 'Введите правильный ИНН');
      } else {
        this._removeErrorFor(this._taxNumber);
      }

      const addressValue = this._address.value.trim();
      if (addressValue === '') {
        formIsValid = false;
        this._setErrorFor(this._address, 'Поле обязательно для заполнения');
      } else {
        this._removeErrorFor(this._address);
      }
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

  _isTaxNumber(value) {
    return /^[0-9]{12}$/.test(value);
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
    this._orgForm.addEventListener('change', this._handleOrgFormChange.bind(this));
  }
}

const companyCreationForm = document.querySelector('.js-company-creation-form');
if (companyCreationForm) {
  new CompanyCreationForm(companyCreationForm);
}
/* End Company Creation Form */