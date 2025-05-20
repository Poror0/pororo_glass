// Плавная прокрутка для всех якорных ссылок и закрытие мобильного меню
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        // Пропускаем пустые ссылки или ссылки без существующего элемента
        if (targetId === '#' || !document.querySelector(targetId)) return;
        
        e.preventDefault(); // Предотвращаем стандартный переход
        
        const targetSection = document.querySelector(targetId);
        const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const duration = 1000; // Длительность анимации в миллисекундах
        const start = window.pageYOffset;
        const distance = offsetTop - start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Функция плавности (easeInOutQuad)
            const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            window.scrollTo(0, start + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Закрытие мобильного меню после завершения прокрутки
                const mobileMenu = document.querySelector('.mobile-menu');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileMenu && menuBtn && mobileMenu.classList.contains('active')) {
                     mobileMenu.classList.remove('active');
                     menuBtn.classList.remove('active');
                }
            }
        }

        requestAnimationFrame(animation);
    });
});

// Мобильное меню - только переключение состояния
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

// Закрытие мобильного меню при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
    }
});

document.addEventListener("DOMContentLoaded", () => {
  // Элементы формы
  const contactForm = document.getElementById("contactForm")
  const phoneInput = document.getElementById("phone")
  const agreementCheckbox = document.getElementById("agreement")
  const submitButton = document.getElementById("submitButton")
  const phoneError = document.getElementById("phoneError")
  const agreementError = document.getElementById("agreementError")

  // Элементы модального окна
  const successModal = document.getElementById("successModal")
  const modalOverlay = document.getElementById("modalOverlay")
  const closeModalButton = document.getElementById("closeModalButton")
  const closeModalX = document.querySelector(".close-modal")

  // Элементы модального окна условий
  const termsModal = document.getElementById("termsModal");
  const termsLinks = document.querySelectorAll('.terms-link');
  const closeTermsModalButton = document.getElementById("closeTermsModalButton");
  const closeTermsModalX = termsModal ? termsModal.querySelector(".close-modal") : null;

  // Маска для телефона
  function setPhoneMask() {
    const phoneMask = new IMask(phoneInput, {
      mask: "+7 (000) 000-00-00",
      lazy: false,
    })
  }

  // Проверяем, загружена ли библиотека IMask
  let IMask // Объявляем переменную IMask
  if (typeof window.IMask !== "undefined") {
    IMask = window.IMask
    setPhoneMask()
  } else {
    // Если библиотека не загружена, добавляем её
    const script = document.createElement("script")
    script.src = "https://unpkg.com/imask@6.4.3/dist/imask.js"
    script.onload = () => {
      IMask = window.IMask
      setPhoneMask()
    }
    document.head.appendChild(script)
  }

  // Валидация телефона
  function validatePhone() {
    const phoneValue = phoneInput.value.replace(/\D/g, "")

    if (phoneValue.length !== 11) {
      phoneError.textContent = "Введите корректный номер телефона"
      phoneError.style.display = "block"
      return false
    }

    if (phoneValue[0] !== "7") {
      phoneError.textContent = "Номер должен начинаться с +7"
      phoneError.style.display = "block"
      return false
    }

    phoneError.style.display = "none"
    return true
  }

  // Проверка состояния чекбокса
  function validateAgreement() {
    if (!agreementCheckbox.checked) {
      agreementError.textContent = "Необходимо согласиться с условиями"
      agreementError.style.display = "block"
      return false
    }

    agreementError.style.display = "none"
    return true
  }

  // Проверка формы и активация/деактивация кнопки
  function validateForm() {
    const isPhoneValid = validatePhone()
    const isAgreementValid = validateAgreement()

    submitButton.disabled = !(isPhoneValid && isAgreementValid)
  }

  // Обработчики событий для валидации
  phoneInput.addEventListener("input", validateForm)
  phoneInput.addEventListener("blur", validatePhone)
  agreementCheckbox.addEventListener("change", validateForm)

  // Отправка формы
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (validatePhone() && validateAgreement()) {
      // Здесь можно добавить код для отправки данных на сервер
      // Например, с использованием fetch API

      // Показываем модальное окно
      successModal.style.display = "block"
      modalOverlay.style.display = "block"

      // Сбрасываем форму
      contactForm.reset()
      submitButton.disabled = true
    }
  })

  // Закрытие модального окна
  function closeModal() {
    successModal.style.display = "none"
    modalOverlay.style.display = "none"
  }

  closeModalButton.addEventListener("click", closeModal)
  closeModalX.addEventListener("click", closeModal)
  modalOverlay.addEventListener("click", closeModal)

  // Предотвращаем закрытие модального окна при клике на его содержимое
  successModal.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Функции для открытия/закрытия модального окна условий
  function openTermsModal(e) {
      e.preventDefault(); // Prevent the default link behavior
      if (termsModal && modalOverlay) {
          termsModal.style.display = "block";
          modalOverlay.style.display = "block";
      }
  }

  function closeTermsModal() {
      if (termsModal && modalOverlay) {
          termsModal.style.display = "none";
          modalOverlay.style.display = "none";
      }
  }

  // Обработчики событий для модального окна условий
  if (termsLinks) {
      termsLinks.forEach(link => {
          link.addEventListener("click", openTermsModal);
      });
  }

  if (closeTermsModalButton) {
      closeTermsModalButton.addEventListener("click", closeTermsModal);
  }

  if (closeTermsModalX) {
      closeTermsModalX.addEventListener("click", closeTermsModal);
  }

  if (modalOverlay) {
      modalOverlay.addEventListener("click", closeTermsModal); // Close terms modal by clicking overlay
  }

  // Prevent closing terms modal when clicking inside
  if (termsModal) {
      termsModal.addEventListener("click", (e) => {
          e.stopPropagation();
      });
  }

  // Элементы модального окна настройки cookie
  const cookieModal = document.getElementById("cookieModal");
  const cookieLink = document.querySelector('.cookie-settings-link'); // Changed selector to use the new class
  const closeCookieModalButton = document.getElementById("closeCookieModalButton");
  const closeCookieModalX = cookieModal ? cookieModal.querySelector(".close-modal") : null;

  // Функции для открытия/закрытия модального окна cookie
  function openCookieModal(e) {
      e.preventDefault(); // Prevent the default link behavior
      if (cookieModal && modalOverlay) {
          cookieModal.style.display = "block";
          modalOverlay.style.display = "block";
      }
  }

  function closeCookieModal() {
      if (cookieModal && modalOverlay) {
          cookieModal.style.display = "none";
          modalOverlay.style.display = "none";
      }
  }

  // Обработчики событий для модального окна cookie
  if (cookieLink) {
      cookieLink.addEventListener("click", openCookieModal);
  }

  if (closeCookieModalButton) {
      closeCookieModalButton.addEventListener("click", closeCookieModal);
  }

  if (closeCookieModalX) {
      closeCookieModalX.addEventListener("click", closeCookieModal);
  }

  // Close cookie modal by clicking overlay (already handled by terms modal overlay listener, but good to be explicit)
  // if (modalOverlay) {
  //     modalOverlay.addEventListener("click", closeCookieModal);
  // }

  // Prevent closing cookie modal when clicking inside
  if (cookieModal) {
      cookieModal.addEventListener("click", (e) => {
          e.stopPropagation();
      });
  }

  // Элементы модального окна ввода номера заявки
  const applicationNumberModal = document.getElementById("applicationNumberModal");
  const cartIcon = document.querySelector('.cart-icon'); // Select the cart icon link
  const applicationNumberInput = document.getElementById("applicationNumberInput");
  const submitApplicationNumberButton = document.getElementById("submitApplicationNumber");
  const applicationNumberError = document.getElementById("applicationNumberError");
  const closeApplicationNumberX = applicationNumberModal ? applicationNumberModal.querySelector(".close-modal") : null;

  // Элементы модального окна деталей заявки
  const applicationDetailsModal = document.getElementById("applicationDetailsModal");
  const detailProduct = document.getElementById("detailProduct");
  const detailDate = document.getElementById("detailDate");
  const detailAddress = document.getElementById("detailAddress");
    const detailStatus = document.getElementById("detailStatus");
  const closeDetailsModalButton = document.getElementById("closeDetailsModalButton");
  const closeDetailsModalX = applicationDetailsModal ? applicationDetailsModal.querySelector(".close-modal") : null;

  // Функции для открытия/закрытия модальных окон
  function openModal(modal) {
      if (modal && modalOverlay) {
          modal.style.display = "block";
          modalOverlay.style.display = "block";
      }
  }

  function closeModal(modal) {
      if (modal && modalOverlay) {
          modal.style.display = "none";
          modalOverlay.style.display = "none";
      }
  }

  // Обработчик клика на иконку корзины
  if (cartIcon) {
      cartIcon.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent default link behavior
          openModal(applicationNumberModal);
          // Clear previous input and error message
          if (applicationNumberInput) applicationNumberInput.value = '';
          if (applicationNumberError) applicationNumberError.textContent = '';
          if (applicationNumberError) applicationNumberError.style.display = 'none';
      });
  }

  // Обработчик клика на кнопку "Проверить" в модальном окне номера заявки
  if (submitApplicationNumberButton) {
      submitApplicationNumberButton.addEventListener("click", () => {
          const enteredNumber = applicationNumberInput ? applicationNumberInput.value.trim() : '';
          if (enteredNumber === "test") {
              // Populate details with random info and show details modal
              if (detailProduct) detailProduct.textContent = "Козырьки и навесы";
              if (detailDate) detailDate.textContent = "" + new Date().toLocaleDateString(); // Example date
              if (detailAddress) detailAddress.textContent = "г. Санкт-Петербург, ул. Вымышленная, д. 456"; // Example address
              if (detailStatus) detailStatus.textContent = "В обработке"; // Example status

              closeModal(applicationNumberModal); // Close number input modal
              openModal(applicationDetailsModal); // Open details modal
          } else {
              // Show error message
              if (applicationNumberError) {
                  applicationNumberError.textContent = "Неверный номер заявки. Попробуйте 'test'.";
                  applicationNumberError.style.display = "block";
              }
          }
      });
  }

  // Обработчики закрытия модального окна номера заявки
  if (closeApplicationNumberX) {
      closeApplicationNumberX.addEventListener("click", () => closeModal(applicationNumberModal));
  }
  // Close on overlay click (handled by general overlay listener, but can be explicit)
  // if (modalOverlay) {
  //     modalOverlay.addEventListener("click", () => closeModal(applicationNumberModal));
  // }

  // Обработчики закрытия модального окна деталей заявки
  if (closeDetailsModalButton) {
      closeDetailsModalButton.addEventListener("click", () => closeModal(applicationDetailsModal));
  }
  if (closeDetailsModalX) {
      closeDetailsModalX.addEventListener("click", () => closeModal(applicationDetailsModal));
  }
  // Close on overlay click (handled by general overlay listener, but can be explicit)
  // if (modalOverlay) {
  //     modalOverlay.addEventListener("click", () => closeModal(applicationDetailsModal));
  // }

    // Prevent closing modals when clicking inside
    if(applicationNumberModal) {
        applicationNumberModal.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    if(applicationDetailsModal) {
        applicationDetailsModal.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

}); // End DOMContentLoaded