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
    const navbar = document.querySelector('.navbar'); // Get the navbar element

    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');

    // Adjust mobile menu position based on navbar height when opening
    if (mobileMenu.classList.contains('active') && navbar) {
        const navbarHeight = navbar.offsetHeight;
        mobileMenu.style.top = navbarHeight + 'px';
    }
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
  function closeModal(modalElement) {
    if (modalElement) {
      modalElement.style.display = "none";
    }
    if (modalOverlay) {
      modalOverlay.style.display = "none";
    }
  }

  // Use the closeModal function with the specific modal
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => closeModal(successModal));
  }
  if (closeModalX) {
    closeModalX.addEventListener("click", () => closeModal(successModal));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => closeModal(successModal)); // Close success modal on overlay click
  }

  // Предотвращаем закрытие модального окна при клике на его содержимое
  successModal.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Функции для открытия/закрытия модального окна условий
  function openTermsModal(e) {
      e.preventDefault(); // Предотвращаем стандартное поведение ссылки
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
      modalOverlay.addEventListener("click", closeTermsModal); // Закрываем модальное окно условий при клике на оверлей
  }

  // Предотвращаем закрытие модального окна условий при клике внутри него
  if (termsModal) {
      termsModal.addEventListener("click", (e) => {
          e.stopPropagation();
      });
  }

  // Элементы модального окна настройки cookie
  const cookieModal = document.getElementById("cookieModal");
  const cookieLink = document.querySelector('.cookie-settings-link'); // Изменен селектор для использования нового класса
  const closeCookieModalButton = document.getElementById("closeCookieModalButton");
  const closeCookieModalX = cookieModal ? cookieModal.querySelector(".close-modal") : null;

  // Функции для открытия/закрытия модального окна cookie
  function openCookieModal(e) {
      e.preventDefault(); // Предотвращаем стандартное поведение ссылки
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

  // Закрываем модальное окно cookie при клике на оверлей (уже обрабатывается общим слушателем оверлея, но явно добавляем для ясности)
  // if (modalOverlay) {
  //     modalOverlay.addEventListener("click", closeCookieModal);
  // }

  // Предотвращаем закрытие модального окна cookie при клике внутри него
  if (cookieModal) {
      cookieModal.addEventListener("click", (e) => {
          e.stopPropagation();
      });
  }

  // Элементы модального окна ввода номера заявки
  const applicationNumberModal = document.getElementById("applicationNumberModal");
  const cartIcon = document.querySelector('.cart-icon'); // Выбираем ссылку на иконку корзины
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
          e.preventDefault(); // Предотвращаем стандартное поведение ссылки
          openModal(applicationNumberModal);
          // Очищаем предыдущий ввод и сообщение об ошибке
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
              // Заполняем детали случайной информацией и показываем модальное окно деталей
              if (detailProduct) detailProduct.textContent = "Козырьки и навесы";
              if (detailDate) detailDate.textContent = "" + new Date().toLocaleDateString(); // Пример даты
              if (detailAddress) detailAddress.textContent = "г. Санкт-Петербург, ул. Вымышленная, д. 456"; // Пример адреса
              if (detailStatus) detailStatus.textContent = "В обработке"; // Пример статуса

              closeModal(applicationNumberModal); // Закрываем модальное окно ввода номера
              openModal(applicationDetailsModal); // Открываем модальное окно деталей
          } else {
              // Показываем сообщение об ошибке
              if (applicationNumberError) {
                  applicationNumberError.textContent = "Неверный номер заявки";
                  applicationNumberError.style.display = "block";
              }
          }
      });
  }

  // Обработчики закрытия модального окна номера заявки
  if (closeApplicationNumberX) {
      closeApplicationNumberX.addEventListener("click", () => closeModal(applicationNumberModal));
  }
  // Закрываем при клике на оверлей (обрабатывается общим слушателем оверлея, но явно добавляем для ясности)
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
  // Закрываем при клике на оверлей (обрабатывается общим слушателем оверлея, но явно добавляем для ясности)
  // if (modalOverlay) {
  //     modalOverlay.addEventListener("click", () => closeModal(applicationDetailsModal));
  // }

    // Предотвращаем закрытие модальных окон при клике внутри них
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

  // --- Функционал модального окна отзывов ---
  const writeReviewBtn = document.querySelector('.write-review-btn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalOverlay = document.getElementById('reviewModalOverlay');
  const closeReviewModalX = reviewModal ? reviewModal.querySelector('.close-modal') : null;
  const reviewForm = document.getElementById('reviewForm');
  const ratingStars = reviewModal ? reviewModal.querySelectorAll('.rating-star') : null;
  const reviewRatingInput = document.getElementById('reviewRating');

  // Элементы для сообщения благодарности
  const reviewModalContent = reviewModal ? reviewModal.querySelector('.review-modal-content') : null;
  let reviewFormHTML = ''; // Для сохранения оригинального HTML формы

  // Функция открытия модального окна отзыва
  function openReviewModal() {
      if (reviewModal && reviewModalOverlay) {
          // Восстанавливаем оригинальную форму, если она была заменена сообщением благодарности
          if (reviewModalContent && reviewFormHTML) {
              reviewModalContent.innerHTML = reviewFormHTML;
              // Снова получаем элементы после восстановления HTML
              const newReviewForm = document.getElementById('reviewForm');
              const newRatingStars = newReviewForm ? newReviewForm.querySelectorAll('.rating-star') : null;
              const newReviewRatingInput = document.getElementById('reviewRating');
              if (newReviewForm && newRatingStars && newReviewRatingInput) {
                  setupReviewFormListeners(newReviewForm, newRatingStars, newReviewRatingInput);
              }
          }

          reviewModal.style.display = 'block';
          reviewModalOverlay.style.display = 'block';
          // Сбрасываем звезды при открытии
          if (ratingStars && reviewRatingInput) {
              resetStars(ratingStars, reviewRatingInput);
          }
      }
  }

  // Функция закрытия модального окна отзыва
  function closeReviewModal() {
      if (reviewModal && reviewModalOverlay) {
          reviewModal.style.display = 'none';
          reviewModalOverlay.style.display = 'none';
          // Сбрасываем форму и звезды при закрытии
          if (reviewForm) {
            reviewForm.reset();
          }
          if (ratingStars && reviewRatingInput) {
              resetStars(ratingStars, reviewRatingInput);
          }
           // Восстанавливаем оригинальную форму, если она была заменена сообщением благодарности
          if (reviewModalContent && reviewFormHTML) {
              reviewModalContent.innerHTML = reviewFormHTML;
              const newReviewForm = document.getElementById('reviewForm');
              const newRatingStars = newReviewForm ? newReviewForm.querySelectorAll('.rating-star') : null;
              const newReviewRatingInput = document.getElementById('reviewRating');
               if (newReviewForm && newRatingStars && newReviewRatingInput) {
                  setupReviewFormListeners(newReviewForm, newRatingStars, newReviewRatingInput);
               }
          }
      }
  }

  // Функция сброса звезд
  function resetStars(stars, ratingInput) {
       stars.forEach(star => star.classList.remove('active'));
       if (ratingInput) {
         ratingInput.value = ''; // Или установите значение по умолчанию, например 0 или 5
       }
  }

  // Функция обработки выбора рейтинга звездами
  function handleStarRating(e, stars, ratingInput) {
      const clickedStar = e.target;
      const value = parseInt(clickedStar.getAttribute('data-value'), 10);

      stars.forEach(star => {
          if (parseInt(star.getAttribute('data-value'), 10) <= value) {
              star.classList.add('active');
          } else {
              star.classList.remove('active');
          }
      });

      if (ratingInput) {
          ratingInput.value = value;
      }
  }

    // Функция настройки слушателей формы отзыва
    function setupReviewFormListeners(form, stars, ratingInput) {
         // Добавляем слушатель событий для рейтинга звезд
        if (stars) {
            stars.forEach(star => {
                star.addEventListener('click', (e) => handleStarRating(e, stars, ratingInput));
            });
        }

        // Добавляем слушатель событий для отправки формы
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Здесь обычно отправляются данные формы на сервер
                console.log('Review submitted:', { // Отправленный отзыв:
                    name: document.getElementById('reviewName').value,
                    rating: ratingInput.value,
                    title: document.getElementById('reviewTitle').value,
                    text: document.getElementById('reviewText').value,
                    // image: document.getElementById('reviewImage').files[0] // Обработка загрузки файла отдельно
                });

                // Отображаем сообщение благодарности
                if (reviewModalContent) {
                     reviewFormHTML = reviewModalContent.innerHTML; // Сохраняем оригинальный HTML формы
                     reviewModalContent.innerHTML = `
                        <span class="close-modal">&times;</span>
                        <div style="text-align: center; padding: 20px;">
                            <div class="success-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="32" cy="32" r="30" stroke="#35ABC5" stroke-width="4"/>
                                    <path d="M20 32L28 40L44 24" stroke="#35ABC5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h3>Спасибо за Ваш отзыв!</h3>
                            <p>Ваш отзыв был успешно отправлен.</p>
                            <button class="modal-button" id="closeReviewSuccessModalButton">Закрыть</button>
                        </div>
                    `;
                     // Снова получаем кнопку закрытия для сообщения об успешной отправке
                     const closeReviewSuccessModalButton = document.getElementById('closeReviewSuccessModalButton');
                     if (closeReviewSuccessModalButton) {
                         closeReviewSuccessModalButton.addEventListener('click', closeReviewModal);
                     }
                      const closeReviewSuccessModalX = reviewModalContent.querySelector('.close-modal');
                       if(closeReviewSuccessModalX){
                         closeReviewSuccessModalX.addEventListener('click', closeReviewModal);
                       }
                }
            });
        }
    }

  // --- Слушатели событий модального окна отзывов ---
  if (writeReviewBtn) {
      writeReviewBtn.addEventListener('click', openReviewModal);
  }

  if (closeReviewModalX) {
      closeReviewModalX.addEventListener('click', closeReviewModal);
  }

  if (reviewModalOverlay) {
      reviewModalOverlay.addEventListener('click', closeReviewModal); // Закрываем модальное окно отзыва при клике на оверлей
  }

   // Предотвращаем закрытие модального окна отзыва при клике внутри него (до замены формы)
   if(reviewModal && reviewForm) { // Проверяем, существует ли форма изначально
       reviewModal.addEventListener("click", (e) => {
           if (!reviewModalContent.contains(e.target) || reviewFormHTML) { // Предотвращаем распространение, если клик не внутри контента модального окна или после восстановления формы
              e.stopPropagation();
           }
       });
   }

  // Начальная настройка слушателей формы отзыва
   if (reviewForm && ratingStars && reviewRatingInput) {
       setupReviewFormListeners(reviewForm, ratingStars, reviewRatingInput);
   }

  // --- Функционал модального окна изображений ---
  const imageModal = document.getElementById('imageModal');
  const enlargedReviewImage = document.querySelector('.enlarged-review-image');
  const closeImageModalX = imageModal ? imageModal.querySelector('.close-image-modal') : null;
  // Повторно используем существующий оверлей модального окна для модального окна изображений
  // const imageModalOverlay = document.getElementById('imageModalOverlay'); // Если нужен отдельный оверлей
  const reviewImages = document.querySelectorAll('.review-image');

  // Функция открытия модального окна изображения
  function openImageModal(imageSrc) {
      if (imageModal && modalOverlay && enlargedReviewImage) { // Повторно используем modalOverlay
          enlargedReviewImage.src = imageSrc;
          imageModal.style.display = 'block';
          modalOverlay.style.display = 'block'; // Используем существующий оверлей
           // Предотвращаем прокрутку фона, когда модальное окно открыто
           document.body.style.overflow = 'hidden';
      }
  }

  // Функция закрытия модального окна изображения
  function closeImageModal() {
      if (imageModal && modalOverlay) { // Повторно используем modalOverlay
          imageModal.style.display = 'none';
          modalOverlay.style.display = 'none'; // Используем существующий оверлей
           // Восстанавливаем прокрутку фона
           document.body.style.overflow = '';
      }
  }

  // Добавляем слушатели событий клика к изображениям отзывов
  if (reviewImages) {
      reviewImages.forEach(image => {
          image.addEventListener('click', () => {
              openImageModal(image.src);
          });
      });
  }

  // --- Слушатели событий модального окна изображений ---
  if (closeImageModalX) {
      closeImageModalX.addEventListener('click', closeImageModal);
  }

   // Закрываем модальное окно при клике вне изображения (на фоне модального окна)
   if (imageModal) {
       imageModal.addEventListener('click', (e) => {
           // Проверяем, был ли клик непосредственно по фону модального окна, а не по содержимому изображения
           if (e.target === imageModal) {
               closeImageModal();
           }
       });
   }

   // Закрываем модальное окно изображения при клике на основной оверлей модального окна
   // Этот слушатель уже добавлен для других модальных окон, но явно добавляем для ясности, если нужно
   // if (modalOverlay) {
   //      modalOverlay.addEventListener('click', closeImageModal);
   // }


}); // Конец DOMContentLoaded

// Функционал калькулятора стоимости
document.addEventListener("DOMContentLoaded", function() {
  // Получаем элементы калькулятора
  const calculatorForm = document.getElementById("costCalculator");
  const calculateButton = document.getElementById("calculateButton");
  const resultDetails = document.getElementById("resultDetails");
  const materialsCostElement = document.getElementById("materialsCost");
  const optionsCostElement = document.getElementById("optionsCost");
  const totalCostElement = document.getElementById("totalCost");
  
  // Базовые цены за квадратный метр для разных типов конструкций (в рублях)
  const basePrices = {
    partition: 5000,  // Стеклянная перегородка
    shower: 7000,     // Душевая кабина
    door: 8000,       // Стеклянная дверь
    railing: 6000,    // Ограждение из стекла
    canopy: 9000      // Козырек или навес
  };
  
  // Коэффициенты для разных типов стекла
  const glassTypeCoefficients = {
    transparent: 1.0,  // Прозрачное
    matte: 1.2,        // Матовое
    tinted: 1.3,       // Тонированное
    tempered: 1.5,     // Закаленное
    laminated: 1.7     // Ламинированное
  };
  
  // Коэффициенты для разной толщины стекла
  const thicknessCoefficients = {
    "6": 1.0,   // 6 мм
    "8": 1.2,   // 8 мм 
    "10": 1.4,  // 10 мм
    "12": 1.6   // 12 мм
  };
  
  // Стоимость дополнительных опций
  const optionPrices = {
    installation: 3000,  // Монтаж
    delivery: 2000,      // Доставка
    hardware: 5000       // Фурнитура
  };
  
  // Обработчик нажатия на кнопку расчета
  calculateButton.addEventListener("click", function() {
    // Проверяем, что все обязательные поля заполнены
    if (!validateForm()) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    // Получаем значения из формы
    const productType = document.getElementById("productType").value;
    const glassType = document.getElementById("glassType").value;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const thickness = document.getElementById("thickness").value;
    
    // Проверяем выбранные дополнительные опции
    const installation = document.getElementById("installation").checked;
    const delivery = document.getElementById("delivery").checked;
    const hardware = document.getElementById("hardware").checked;
    
    // Рассчитываем площадь в квадратных метрах
    const area = (width * height) / 10000; // переводим из см² в м²
    
    // Рассчитываем базовую стоимость материалов
    let materialsCost = basePrices[productType] * area;
    
    // Применяем коэффициенты для типа и толщины стекла
    materialsCost *= glassTypeCoefficients[glassType];
    materialsCost *= thicknessCoefficients[thickness];
    
    // Рассчитываем стоимость дополнительных опций
    let optionsCost = 0;
    if (installation) optionsCost += optionPrices.installation;
    if (delivery) optionsCost += optionPrices.delivery;
    if (hardware) optionsCost += optionPrices.hardware;
    
    // Рассчитываем итоговую стоимость
    const totalCost = materialsCost + optionsCost;
    
    // Отображаем результаты
    materialsCostElement.textContent = formatPrice(materialsCost);
    optionsCostElement.textContent = formatPrice(optionsCost);
    totalCostElement.textContent = formatPrice(totalCost);
    
    // Показываем блок с результатами
    resultDetails.style.display = "block";
    
    // Прокручиваем к результатам
    resultDetails.scrollIntoView({ behavior: "smooth", block: "nearest" });
    
    // Добавляем анимацию для привлечения внимания
    animateResult();
  });
  
  // Функция для проверки заполнения формы
  function validateForm() {
    const requiredFields = [
      "productType",
      "glassType",
      "width",
      "height",
      "thickness"
    ];
    
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field.value) {
        field.focus();
        return false;
      }
    }
    
    return true;
  }
  
  // Функция для форматирования цены
  function formatPrice(price) {
    return Math.round(price).toLocaleString("ru-RU") + " ₽";
  }
  
  // Функция для анимации результата
  function animateResult() {
    const resultElement = document.getElementById("calculationResult");
    resultElement.classList.add("highlight");
    
    setTimeout(() => {
      resultElement.classList.remove("highlight");
    }, 1000);
  }
  
  // Добавляем стили для анимации
  const style = document.createElement("style");
  style.textContent = `
    .calculation-result.highlight {
      animation: highlight-pulse 1s ease-in-out;
    }
    
    @keyframes highlight-pulse {
      0% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
      50% { box-shadow: 0 4px 20px rgba(53, 171, 197, 0.3); }
      100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
    }
  `;
  document.head.appendChild(style);
  
  // Обработчики для изменения типа продукта (для динамического обновления изображения)
  document.getElementById("productType").addEventListener("change", function(e) {
    updateCalculatorImage(e.target.value);
  });
  
  // Функция для обновления изображения в зависимости от выбранного типа продукта
  function updateCalculatorImage(productType) {
    const calculatorImage = document.querySelector(".calculator-image img");
    
    // Используем существующие изображения
    switch(productType) {
      case "partition":
        calculatorImage.src = "img/стекланныеперегородки.png";
        calculatorImage.alt = "Стеклянная перегородка";
        break;
      case "shower":
        calculatorImage.src = "img/душевыекабинки.png";
        calculatorImage.alt = "Душевая кабина";
        break;
      case "door":
        calculatorImage.src = "img/стекланныеперегородки.png"; // Используем изображение перегородок как временное
        calculatorImage.alt = "Стеклянная дверь";
        break;
      case "railing":
        calculatorImage.src = "img/козырькиинавесы.png"; // Используем изображение козырьков как временное
        calculatorImage.alt = "Ограждение из стекла";
        break;
      case "canopy":
        calculatorImage.src = "img/козырькиинавесы1.png";
        calculatorImage.alt = "Козырек или навес";
        break;
      default:
        calculatorImage.src = "img/i.webp";
        calculatorImage.alt = "Стеклянная конструкция";
    }
    
    // Обработка ошибки загрузки изображения
    calculatorImage.onerror = function() {
      this.src = "img/i.webp";
    };
  }
});