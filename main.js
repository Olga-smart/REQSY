"use strict";

// #region Img Uploader
class ImageUploader {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._input = component.querySelector('.js-img-uploader__input');
    this._imageAreas = Array.from(component.querySelectorAll('.js-img-uploader__img-area'));
    this._button = component.querySelector('.js-img-uploader__button');
  }

  _handleButtonClick() {
    this._input.click();
  }

  _handleInputChange() {
    const images = this._input.files;

    if (images) {
      this._removePreviousImages();

      for (let i = 0; i < 3; i++) {
        if (!images[i]) return;

        const reader = new FileReader();

        reader.onload = () => {    
          const img = document.createElement('img');
          img.src = reader.result;
          img.className = 'img-uploader__img js-img-uploader__img';
          this._imageAreas[this._imageAreas.length - (i + 1)].append(img);
        };

        reader.readAsDataURL(images[i]);
      }
    }
  }

  _removePreviousImages() {
    this._imageAreas.forEach((area) => {
      const image = area.querySelector('.js-img-uploader__img');
      if (image) {
        image.remove();
      }
    });
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
// #endregion Img Uploader

// #region Phone Mask
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
    });

    input.addEventListener('blur', () => {
      mask.updateOptions({
        lazy: true,
      });
    });
  });
}
// #endregion Phone Mask

// #region Registration Form
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
// #endregion Registration Form

// #region Modal
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
// #endregion Modal

// #region Select
class Select {
  constructor(component) {
    this._initFields(component);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._attachEventHandlers();
    this._setSelectedValueIfNecessary();
  }

  toggle() {
    this._component.classList.toggle('select_opened');

    if (this._component.classList.contains('select_opened')) {
      const focusPlaceholder = this._input.dataset.focusPlaceholder;
      if (focusPlaceholder) {
        this._input.placeholder = focusPlaceholder;
      }

      window.addEventListener('click', this._handleOutsideClick);
    }

    if (!this._component.classList.contains('select_opened')) {
      if (this._initialPlaceholder) {
        this._input.placeholder = this._initialPlaceholder;
      }

      window.removeEventListener('click', this._handleOutsideClick);
    }
  } 

  _initFields(component) {
    this._component = component;
    this._input = component.querySelector('.js-select__input');
    this._items = component.querySelectorAll('.js-select__item');
    this._initialPlaceholder = this._input.placeholder;
  }

  _setSelectedValueIfNecessary() {
    this._items.forEach((item) => {
      if (item.classList.contains('select__item_selected')) {
        this._input.value = item.textContent;

        if (this._input.classList.contains('js-select__input_width_auto')) {
          this._adjustInputWidth();
        }
      }
    });
  }

  _adjustInputWidth() {
    const style = window.getComputedStyle(this._input);
    const leftPadding = parseInt(style.paddingLeft);
    const rightPadding = parseInt(style.paddingRight);
    const valueWidth = (this._input.value.length) * 8;

    this._input.style.width = '100%';
    const maxWidth = parseInt(window.getComputedStyle(this._input).width);

    const desiredWidth = leftPadding + valueWidth + rightPadding;
    
    this._input.style.width = `${Math.min(maxWidth, desiredWidth)}px`;
  }

  _handleItemClick(item) {
    this._items.forEach((item) => {
      item.classList.remove('select__item_selected');
    });

    item.classList.add('select__item_selected');
    this._input.value = item.textContent;
    this._input.dispatchEvent(new Event('change'));
    this.toggle();

    if (this._input.classList.contains('js-select__input_width_auto')) {
      this._adjustInputWidth();
    }
  }

  _handleOutsideClick(event) {
    const { target } = event;
    const clickOnSelect = this._component.contains(target);

    if (!clickOnSelect) {
      this.toggle();
    }
  }

  _attachEventHandlers() {
    this._input.addEventListener('click', this.toggle.bind(this));

    this._items.forEach((item) => {
      item.addEventListener('click', this._handleItemClick.bind(this, item));
    });
  }
}

const selects = document.querySelectorAll('.js-select');
if (selects) {
  selects.forEach((select) => {
    new Select(select);
  });
}
// #endregion Select

// #region Company Creation Form
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
// #endregion Company Creation Form

// #region Scroll Top Button
class ScrollTopButton {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
    this._showOrHideIfNecessary();
  }

  show() {
    this._component.classList.add('page__scroll-top-button_visible');
  }

  hide() {
    this._component.classList.remove('page__scroll-top-button_visible');
  }

  _initFields(component) {
    this._component = component;
  }
  
  _handleClick() {
    window.scrollTo(0, 0);
  }
  
  _showOrHideIfNecessary() {
    const fullPageHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    const windowHeight = document.documentElement.clientHeight;

    if ((fullPageHeight - windowHeight) > (windowHeight / 2)) {
      this.show();
    } else {
      this.hide();
    }
  }

  _attachEventHandlers() {
    this._component.addEventListener('click', this._handleClick);
    window.addEventListener('resize', this._showOrHideIfNecessary.bind(this));
  }
}

const scrollTopButton = document.querySelector('.js-page__scroll-top-button');
if (scrollTopButton) {
  new ScrollTopButton(scrollTopButton);
}
// #endregion Scroll Top Button

// #region Coords Mask
const coordsInputs = document.querySelectorAll('.js-input_coords');
if (coordsInputs) {
  coordsInputs.forEach((input) => {
    IMask(input, {
      mask: Number,
      scale: 6,
      padFractionalZeros: false,
      radix: '.',
      mapToRadix: ['.', ','],
    });
  });
}
// #endregion Coords Mask

// #region Time Mask
const timeInputs = document.querySelectorAll('.js-input_time');
if (timeInputs) {
  timeInputs.forEach((input) => {
    const mask = IMask(input, {
      overwrite: true,
      autofix: true,
      mask: 'HH:MM',
      blocks: {
        HH: {
          mask: IMask.MaskedRange,
          placeholderChar: '0',
          from: 0,
          to: 23,
          maxLength: 2
        },
        MM: {
          mask: IMask.MaskedRange,
          placeholderChar: '0',
          from: 0,
          to: 59,
          maxLength: 2
        }
      }
    });

    input.addEventListener('focus', () => {
      mask.updateOptions({
        lazy: false,
      });
    });

    input.addEventListener('blur', () => {
      mask.updateOptions({
        lazy: true,
      });
    });
  });
}
// #endregion Time Mask

// #region Location Form
class LocationForm {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._name = component.querySelector('.js-location-page__name');
    this._address = component.querySelector('.js-location-page__address');
    this._latitude = component.querySelector('.js-location-page__latitude');
    this._longitude = component.querySelector('.js-location-page__longitude');
    this._phone = component.querySelector('.js-location-form__phone');
  }

  _handleSubmit(event) {
    const formIsValid = this._validate();

    if (!formIsValid) {
      event.preventDefault();
    }
  }

  _validate() {
    let formIsValid = true;

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

    const addressValue = this._address.value.trim();
    if (addressValue === '') {
      formIsValid = false;
      this._setErrorFor(this._address, 'Поле обязательно для заполнения');
    } else {
      this._removeErrorFor(this._address);
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

    return formIsValid;
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

const locationForm = document.querySelector('.js-location-page__form');
if (locationForm) {
  new LocationForm(locationForm);
}
// #endregion Location Form

// #region Status Filter
class StatusFilter {
  constructor(component) {
    this._initFields(component);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._attachEventHandlers();
  }

  toggle() {
    this._component.classList.toggle('status-filter_opened');

    if (this._component.classList.contains('status-filter_opened')) {
      window.addEventListener('click', this._handleOutsideClick);
    }

    if (!this._component.classList.contains('status-filter_opened')) {
      window.removeEventListener('click', this._handleOutsideClick);
    }
  }

  _initFields(component) {
    this._component = component;
    this._list = component.querySelector('.js-status-filter__list');
    this._items = component.querySelectorAll('.js-status-filter__item');
    this._output = this._createOutputElement();

    this._items.forEach((item) => {
      if (item.classList.contains('status-filter__item_selected')) {
        this._updateOutput(item);
      }
    });
  }

  _createOutputElement() {
    const output = document.createElement('div');
    output.className = 'status-filter__output';
    this._component.prepend(output);
    return output;
  }

  _updateOutput(item) {
    const clone = document.createElement('div');
    clone.innerHTML = item.innerHTML;
    clone.classList = item.classList;
    clone.classList.remove('status-filter__item_selected');

    this._output.innerHTML = '';
    this._output.append(clone);
  }

  _handleListMouseOver(event) {
    if (event.target.classList.contains('status-filter__item')) {
      this._list.style.setProperty('--underline-width', `${event.target.offsetWidth}px`);
      this._list.style.setProperty('--underline-offset-x', `${event.target.offsetLeft}px`);
    }
  }

  _handleListMouseLeave () {
    this._list.style.setProperty('--underline-width', '0')
  }

  _handleItemClick(item) {
    this._items.forEach((item) => {
      item.classList.remove('status-filter__item_selected');
    });

    item.classList.add('status-filter__item_selected');
    this._updateOutput(item);
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
    this._list.addEventListener('mouseover', this._handleListMouseOver.bind(this));
    this._list.addEventListener('mouseleave', this._handleListMouseLeave.bind(this));

    this._items.forEach((item) => {
      item.addEventListener('click', this._handleItemClick.bind(this, item));
    });

    this._output.addEventListener('click', this.toggle.bind(this));
  }
}

const statusFilters = document.querySelectorAll('.js-status-filter');
if (statusFilters) {
  statusFilters.forEach((filter) => {
    new StatusFilter(filter);
  });
}
// #endregion Status Filter

// #region Requests Page
class RequestsPage {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();

    if (this._isListInTableForm()) {
      this._cropNames();
    }
  }

  _initFields(component) {
    this._component = component;
    this._names = component.querySelectorAll('.js-requests-page__request-name');
    this._createRequestButton = component.querySelector('.js-requests-page__create-button');
    this._requestCreationModal = document.querySelector('.js-request-creation-modal');
  }

  _cropNames() {
    this._names.forEach((name) => {
      if (name.textContent.length > 19) {
        name.textContent = `${name.textContent.slice(0, 19)}...`
      }
    });
  }

  _restoreNames() {
    this._names.forEach((name) => {
      name.textContent = name.getAttribute('title');
    });
  }

  _isListInTableForm() {
    if (window.innerWidth > 991) {
      return true;
    } else {
      return false;
    } 
  }

  _handleWindowResize() {
    if (this._isListInTableForm()) {
      this._cropNames();
    } else {
      this._restoreNames();
    }
  }

  _handleCreateRequestButtonClick() {
    this._requestCreationModal.classList.add('modal_opened');
  }

  _attachEventHandlers() {
    window.addEventListener('resize', this._handleWindowResize.bind(this));
    this._createRequestButton?.addEventListener('click', this._handleCreateRequestButtonClick.bind(this));
  }
}

const requestsPage = document.querySelector('.js-requests-page');
if (requestsPage) {
  new RequestsPage(requestsPage);
}
// #endregion Requests Page

// #region Request Creation Form
class RequestCreationForm {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._name = component.querySelector('.js-request-creation-form__name');
    this._description = component.querySelector('.js-request-creation-form__description');
  }

  _handleSubmit(event) {
    const formIsValid = this._validate();

    if (!formIsValid) {
      event.preventDefault();
    }
  }

  _validate() {
    let formIsValid = true;

    const nameValue = this._name.value.trim();
    if (nameValue === '') {
      formIsValid = false;
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (nameValue.length < 3) {
      formIsValid = false;
      this._setErrorFor(this._name, 'Слишком мало символов');
    } else {
      this._removeErrorFor(this._name);
    }

    const descriptionValue = this._description.value.trim();
    if (descriptionValue === '') {
      formIsValid = false;
      this._setErrorFor(this._description, 'Поле обязательно для заполнения');
    } else if (descriptionValue.length < 3) {
      formIsValid = false;
      this._setErrorFor(this._description, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._description);
    }

    return formIsValid;
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

const requestCreationForm = document.querySelector('.js-request-creation-form');
if (requestCreationForm) {
  new RequestCreationForm(requestCreationForm);
}
// #endregion Request Creation Form