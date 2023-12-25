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
    this._submitButton = component.querySelector('.js-registration-form__submit-button');
    this._successModal = document.querySelector('.js-registration-modal');
  }

  _handleSubmit(event) {
    event.preventDefault();
    this._successModal.classList.add('modal_opened');
  }

  _handleNameChange() {
    const nameValue = this._name.value.trim();

    if (nameValue === '') {
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (!this._containsOnlyCyrillic(nameValue)) {
      this._setErrorFor(this._name, 'Некорректные символы. Используйте только кириллицу');
    } else if (nameValue.length < 2) {
      this._setErrorFor(this._name, 'Слишком мало символов');
    } else {
      this._removeErrorFor(this._name);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleSurnameChange() {
    const surnameValue = this._surname.value.trim();

    if (surnameValue === '') {
      this._setErrorFor(this._surname, 'Поле обязательно для заполнения');
    } else if (!this._containsOnlyCyrillic(surnameValue)) {
      this._setErrorFor(this._surname, 'Некорректные символы. Используйте только кириллицу');
    } else if (surnameValue.length < 2) {
      this._setErrorFor(this._surname, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._surname);
    }

    this._enableOrDisableSubmitButton();
  }

  _handlePhoneChange() {
    const phoneValue = this._phone.value.replace(/[^0-9]/g,"");

    if (phoneValue === '') {
      this._setErrorFor(this._phone, 'Поле обязательно для заполнения');
    } else if (phoneValue.length !== 11) {
      this._setErrorFor(this._phone, 'Введите правильный телефон');
    } else {
      this._removeErrorFor(this._phone);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleMailChange() {
    const mailValue = this._mail.value.trim();

    if (mailValue === '') {
      this._setErrorFor(this._mail, 'Поле обязательно для заполнения');
    } else if (!this._isEmail(mailValue)) {
      this._setErrorFor(this._mail, 'Введите правильный email');
    } else {
      this._removeErrorFor(this._mail);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleAgreementChange() {
    const agreementIsAccepted = this._agreement.checked;

    if (!agreementIsAccepted) {
      this._setErrorFor(this._agreement, 'Нужно принять соглашение');
    } else {
      this._removeErrorFor(this._agreement);
    }

    this._enableOrDisableSubmitButton();
  }

  _enableOrDisableSubmitButton() {
    if (this._allRequiredFieldsFilled() && this._noErrors()) {
      this._submitButton.disabled = false;
    } else {
      this._submitButton.disabled = true;
    }
  }

  _allRequiredFieldsFilled() {
    return this._name.value !== '' 
        && this._surname.value !== ''
        && this._phone.value !== ''
        && this._mail.value !== '';
  }

  _noErrors() {
    return !this._component.querySelector('.js-form-control_error');
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
    formControl.classList.add('js-form-control_error');
  }

  _removeErrorFor(input) {
    const formControl = input.closest('.js-form-control');
    const errorMessage = formControl.querySelector('.form-control__error-message');
    if (errorMessage) {
      errorMessage.remove();
      formControl.classList.remove('form-control_error');
      formControl.classList.remove('js-form-control_error');
    }
  }

  _attachEventHandlers() {
    this._component.addEventListener('submit', this._handleSubmit.bind(this));
    this._name.addEventListener('change', this._handleNameChange.bind(this));
    this._surname.addEventListener('change', this._handleSurnameChange.bind(this));
    this._phone.addEventListener('change', this._handlePhoneChange.bind(this));
    this._mail.addEventListener('change', this._handleMailChange.bind(this));
    this._agreement.addEventListener('change', this._handleAgreementChange.bind(this));
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
    this._submitButton = component.querySelector('.js-company-creation-form__submit-button')
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

  _handleNameChange() {
    const nameValue = this._name.value.trim();

    if (nameValue === '') {
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (nameValue.length < 2) {
      this._setErrorFor(this._name, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._name);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleTaxNumberChange() {
    const taxNumberValue = this._taxNumber.value.trim();

    if (taxNumberValue === '') {
      this._setErrorFor(this._taxNumber, 'Поле обязательно для заполнения');
    } else if (!this._isTaxNumber(taxNumberValue)) {
      this._setErrorFor(this._taxNumber, 'Введите правильный ИНН');
    } else {
      this._removeErrorFor(this._taxNumber);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleAddressChange() {
    const addressValue = this._address.value.trim();

    if (addressValue === '') {
      this._setErrorFor(this._address, 'Поле обязательно для заполнения');
    } else {
      this._removeErrorFor(this._address);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleAgreementChange() {
    const agreementIsAccepted = this._agreement.checked;

    if (!agreementIsAccepted) {
      this._setErrorFor(this._agreement, 'Нужно принять соглашение');
    } else {
      this._removeErrorFor(this._agreement);
    }

    this._enableOrDisableSubmitButton();
  }

  _isTaxNumber(value) {
    return /^[0-9]{12}$/.test(value);
  }

  _enableOrDisableSubmitButton() {
    if (this._allRequiredFieldsFilled() && this._noErrors()) {
      this._submitButton.disabled = false;
    } else {
      this._submitButton.disabled = true;
    }
  }

  _allRequiredFieldsFilled() {
    if (this._orgForm.value == 'Физическое лицо') {
      return this._name.value !== '';
    } else {
      return this._name.value !== '' 
        && this._taxNumber.value !== ''
        && this._address.value !== '';
    }
  }

  _noErrors() {
    return !this._component.querySelector('.js-form-control_error');
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
    formControl.classList.add('js-form-control_error');
  }

  _removeErrorFor(input) {
    const formControl = input.closest('.js-form-control');
    const errorMessage = formControl.querySelector('.form-control__error-message');
    if (errorMessage) {
      errorMessage.remove();
      formControl.classList.remove('form-control_error');
      formControl.classList.remove('js-form-control_error');
    }
  }

  _attachEventHandlers() {
    this._orgForm.addEventListener('change', this._handleOrgFormChange.bind(this));
    this._name.addEventListener('change', this._handleNameChange.bind(this));
    this._taxNumber.addEventListener('change', this._handleTaxNumberChange.bind(this));
    this._address.addEventListener('change', this._handleAddressChange.bind(this));
    this._agreement.addEventListener('change', this._handleAgreementChange.bind(this));
  }
}

const companyCreationForm = document.querySelector('.js-company-creation-form');
if (companyCreationForm) {
  new CompanyCreationForm(companyCreationForm);
}
// #endregion Company Creation Form

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
        this._input.dispatchEvent(new Event('change'));

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
    this._submitButton = component.querySelector('.js-location-page__save-button');
  }

  _handleNameChange() {
    const nameValue = this._name.value.trim();

    if (nameValue === '') {
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (nameValue.length < 2) {
      this._setErrorFor(this._name, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._name);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleAddressChange() {
    const addressValue = this._address.value.trim();

    if (addressValue === '') {
      this._setErrorFor(this._address, 'Поле обязательно для заполнения');
    } else {
      this._removeErrorFor(this._address);
    }

    this._enableOrDisableSubmitButton();
  }

  _handlePhoneChange() {
    const phoneValue = this._phone.value.replace(/[^0-9]/g,"");

    if (phoneValue === '') {
      this._setErrorFor(this._phone, 'Поле обязательно для заполнения');
    } else if (phoneValue.length !== 11) {
      this._setErrorFor(this._phone, 'Введите правильный телефон');
    } else {
      this._removeErrorFor(this._phone);
    }

    this._enableOrDisableSubmitButton();
  }

  _enableOrDisableSubmitButton() {
    if (this._allRequiredFieldsFilled() && this._noErrors()) {
      this._submitButton.disabled = false;
    } else {
      this._submitButton.disabled = true;
    }
  }

  _allRequiredFieldsFilled() {
    return this._name.value !== '' 
        && this._address.value !== ''
        && this._phone.value !== '';
  }

  _noErrors() {
    return !this._component.querySelector('.js-form-control_error');
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
    formControl.classList.add('js-form-control_error');
  }

  _removeErrorFor(input) {
    const formControl = input.closest('.js-form-control');
    const errorMessage = formControl.querySelector('.form-control__error-message');
    if (errorMessage) {
      errorMessage.remove();
      formControl.classList.remove('form-control_error');
      formControl.classList.remove('js-form-control_error');
    }
  }

  _attachEventHandlers() {
    this._name.addEventListener('change', this._handleNameChange.bind(this));
    this._address.addEventListener('change', this._handleAddressChange.bind(this));
    this._phone.addEventListener('change', this._handlePhoneChange.bind(this));
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
    this._connectedList = document.querySelector('.js-status-filter__connected-list');

    this._items.forEach((item) => {
      if (item.classList.contains('status-filter__item_selected')) {
        this._updateOutput(item);
        if (item.dataset.status !== 'all') {
          this._applyFilter(item.dataset.status);
        }
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

  _applyFilter(status) {
    if (status === 'all') {
      [...this._connectedList.children].forEach((item) => {
        item.classList.remove('hidden');
      });
    } else {
      [...this._connectedList.children].forEach((item) => {
        if (item.dataset.status === status) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }
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
    this._applyFilter(item.dataset.status);
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

const statusFilter = document.querySelector('.js-status-filter');
if (statusFilter) {
  new StatusFilter(statusFilter);
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
    this._submitButton = component.querySelector('.js-request-creation-modal__submit-button');
  }

  _handleNameChange() {
    const nameValue = this._name.value.trim();

    if (nameValue === '') {
      this._setErrorFor(this._name, 'Поле обязательно для заполнения');
    } else if (nameValue.length < 3) {
      this._setErrorFor(this._name, 'Слишком мало символов');
    } else {
      this._removeErrorFor(this._name);
    }

    this._enableOrDisableSubmitButton();
  }

  _handleDescriptionChange() {
    const descriptionValue = this._description.value.trim();

    if (descriptionValue === '') {
      this._setErrorFor(this._description, 'Поле обязательно для заполнения');
    } else if (descriptionValue.length < 3) {
      this._setErrorFor(this._description, 'Слишком мало символов');
    }  else {
      this._removeErrorFor(this._description);
    }

    this._enableOrDisableSubmitButton();
  }

  _enableOrDisableSubmitButton() {
    if (this._allRequiredFieldsFilled() && this._noErrors()) {
      this._submitButton.disabled = false;
    } else {
      this._submitButton.disabled = true;
    }
  }

  _allRequiredFieldsFilled() {
    return this._name.value !== '' 
        && this._description.value !== '';
  }

  _noErrors() {
    return !this._component.querySelector('.js-form-control_error');
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
    formControl.classList.add('js-form-control_error');
  }

  _removeErrorFor(input) {
    const formControl = input.closest('.js-form-control');
    const errorMessage = formControl.querySelector('.form-control__error-message');
    if (errorMessage) {
      errorMessage.remove();
      formControl.classList.remove('form-control_error');
      formControl.classList.remove('js-form-control_error');
    }
  }

  _attachEventHandlers() {
    this._name.addEventListener('change', this._handleNameChange.bind(this));
    this._description.addEventListener('change', this._handleDescriptionChange.bind(this));
  }
}

const requestCreationForm = document.querySelector('.js-request-creation-form');
if (requestCreationForm) {
  new RequestCreationForm(requestCreationForm);
}
// #endregion Request Creation Form

// #region Status Selector
class StatusSelector {
  constructor(component) {
    this._initFields(component);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._attachEventHandlers();
  }

  toggle() {
    this._component.classList.toggle('status-selector_opened');

    if (this._component.classList.contains('status-selector_opened')) {
      window.addEventListener('click', this._handleOutsideClick);
    }

    if (!this._component.classList.contains('status-selector_opened')) {
      window.removeEventListener('click', this._handleOutsideClick);
    }
  }

  _initFields(component) {
    this._component = component;
    this._output = component.querySelector('.js-status-selector__output');
    this._list = component.querySelector('.js-status-selector__list');
    this._items = component.querySelectorAll('.js-status-selector__item');

    this._items.forEach((item) => {
      if (item.classList.contains('status-selector__item_selected')) {
        this._updateOutput(item);
      }
    });
  }

  _updateOutput(item) {
    const statusElement = item.querySelector('.js-request-status');
    const clone = statusElement.cloneNode(true);
    this._output.innerHTML = '';
    this._output.append(clone);
  }

  _handleItemClick(item) {
    this._items.forEach((item) => {
      item.classList.remove('status-selector__item_selected');
    });

    item.classList.add('status-selector__item_selected');
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
    this._items.forEach((item) => {
      item.addEventListener('click', this._handleItemClick.bind(this, item));
    });

    this._output.addEventListener('click', this.toggle.bind(this));
  }
}

const statusSelectors = document.querySelectorAll('.js-status-selector');
if (statusSelectors) {
  statusSelectors.forEach((selector) => {
    new StatusSelector(selector);
  });
}
// #endregion Status Selector

// #region Request Page Photo Viewer
class RequestPagePhotoGroup {
  constructor(component) {
    this._initFields(component);
    this._attachEventHandlers();
  }

  _initFields(component) {
    this._component = component;
    this._button = component.querySelector('.js-request-page__view-photo-button');
    this._venobox = new VenoBox({
      numeration: true,
      share: true,
      overlayColor: 'rgba(0, 0, 0, 0.45)',
    });
  }

  _handleButtonClick() {
    this._component.querySelector('.venobox').dispatchEvent(new Event('click'));
  }

  _attachEventHandlers() {
    this._button.addEventListener('click', this._handleButtonClick.bind(this));
  }
}

const requestPagePhotoGroup = document.querySelectorAll('.js-request-page__photos');
if (requestPagePhotoGroup) {
  requestPagePhotoGroup.forEach((group) => {
    new RequestPagePhotoGroup(group);
  });
}
// #endregion Request Page Photo Viewer

// #region Date Picker
class DatePicker {
  constructor(component) {
    this._initFields(component);
  }
  
  _initFields(component) {
    this._component = component;
    this._input = component.querySelector('.js-date-picker__input');
    this._datePicker = this._initDatePicker();
  }

  _initDatePicker() {
    const cancelButton = {
      content: 'Отмена',
      className: 'button date-picker__cancel-button',
      onClick: (datePicker) => {
        datePicker.clear();
      },
    }

    const choiceButton = {
      content: 'Выбрать',
      className: 'button',
      onClick: (datePicker) => {
        datePicker.hide();
      },
    }

    return new AirDatepicker(this._input, {
      navTitles: {
        days: 'MMMM yyyy',
      },
      buttons: [cancelButton, choiceButton],
      prevHtml: '<svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 9.25L1 5L5.5 0.75" stroke="#131A29" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextHtml: '<svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9.25L5.5 5L1 0.75" stroke="#131A29" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      maxDate: new Date(),
    });
  }
}

const datePickers = document.querySelectorAll('.js-date-picker');
if (datePickers) {
  datePickers.forEach((picker) => {
    new DatePicker(picker);
  });
}
// #endregion Date Picker