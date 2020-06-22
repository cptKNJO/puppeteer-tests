module.exports = {
  logo: 'h1',
  heroText: '[class^=Hero__headline]',
  planet: '[data-react-toolbox="card"]',
  loadMoreBtn: '.Gallery__cta-button___3kPlJ',
  login: {
    card: '.Login__login___3HOEm',
    cancelBtn: '.Login__login___3HOEm button:nth-child(1)',
    submitBtn: '.Login__login___3HOEm button:nth-child(2)',
    usernameInput: '.Login__login___3HOEm input[type=text]',
    passwordInput: '.Login__login___3HOEm input[type=password',
  },
  profileBtn: '.mui-caret',
  slider: {
    bar: '.theme__progress___xkm0P',
    knob: '.theme__innerknob___20XNj',
  },
  dropDown: {
    adults: 'div.theme__dropdown___co-4M:nth-child(3) > ul:nth-child(2)',
    children: 'div.theme__dropdown___co-4M:nth-child(4) > ul:nth-child(2)',
  },
  checkoutForm: {
    form: 'form',
    inputName: 'div.CustomerInfo__input___eFffe:nth-child(1) > input:nth-child(1)',
    inputEmail: 'div.CustomerInfo__input___eFffe:nth-child(2) > input:nth-child(1)',
    inputSSN: 'div.CustomerInfo__input___eFffe:nth-child(3) > input:nth-child(1)',
    inputPhone: 'div.CustomerInfo__input___eFffe:nth-child(4) > input:nth-child(1)',
    dropzone: '.CustomerInfo__dropzone___3tqul',
    termsCheckbox: 'label[data-react-toolbox="checkbox"]',
    payNowBtn: '.OrderSummary__pay-button___1CG2e',
  },
};
