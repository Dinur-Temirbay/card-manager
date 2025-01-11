const addCardButton = document.querySelector(".add__card");
const createCardForm = document.querySelector(".create-card-form");
const payCardsContainer = document.querySelector(".pay-cards");
const cancelBtn = document.querySelector(".cancel-btn");
const submitBtn = document.querySelector(".submit-btn");

let cardToEdit = null; // Ссылка на редактируемую карту

// Ссылки на поля формы
const nameInputField = document.querySelector("input[name='name']");
const cardNumberField = document.querySelector("#cardNumber");
const cardExpiryField = document.querySelector("#cardExpiry");
const cardCVVField = document.querySelector("#cardCVV");

// Открытие формы добавления карты
addCardButton.addEventListener("click", () => {
  createCardForm.style.display = "block";
  clearForm();
  cardToEdit = null; // Убрать ссылку на редактируемую карту
});

// Закрытие формы добавления карты
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createCardForm.style.display = "none";
  clearForm();
});

// Добавление/редактирование карты
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const nameInput = nameInputField.value.trim();
  const cardNumberInput = cardNumberField.value.trim();
  const cardExpiryInput = cardExpiryField.value.trim();
  const cardCVVInput = cardCVVField.value.trim();

  // Проверка заполненности полей
  if (!nameInput || !cardNumberInput || !cardExpiryInput || !cardCVVInput) {
    alert("All fields must be filled out!");
    return;
  }

  // Валидация имени (только буквы)
  if (!/^[a-zA-Z]+$/.test(nameInput)) {
    alert("Name must contain only letters!");
    return;
  }

  // Валидация номера карты
  if (!/^\d{16}$/.test(cardNumberInput)) {
    alert("Card Number must contain exactly 16 digits.");
    return;
  }

  // Валидация CVV (3-4 цифры)
  if (!/^\d{3,4}$/.test(cardCVVInput)) {
    alert("CVV must contain 3 or 4 digits.");
    return;
  }

  // Проверка на дублирование карты (если добавляется новая карта)
  if (!cardToEdit) {
    const existingCards = Array.from(
      payCardsContainer.querySelectorAll(".pay__card")
    );
    if (
      existingCards.some((card) =>
        card.textContent.includes(cardNumberInput.slice(-4))
      )
    ) {
      alert("This card already exists.");
      return;
    }
  }

  // Если карта редактируется, обновляем данные
  if (cardToEdit) {
    const cardInfo = cardToEdit.querySelector(".card__info");
    cardInfo.innerHTML = `
      <p>Name: <i>${nameInput}</i></p>
      <p>${cardNumberInput.replace(/\d{12}/, "•••• •••• •••• ")}</p>
      <p>Expires: <i>${cardExpiryInput}</i></p>
    `;
    createCardForm.style.display = "none";
    clearForm();
    return;
  }

  // Создание нового DOM-элемента для карты
  const newCard = document.createElement("div");
  newCard.classList.add("pay__card");
  newCard.innerHTML = `
    <div class="card__info">
      <p style='display: none;'>Name: <i>${nameInput}</i></p>
      <p>${cardNumberInput.replace(/\d{12}/, "•••• •••• •••• ")}</p>
      <p>Expires: <i>${cardExpiryInput}</i></p>
    </div>
    <div class="card__actions">
      <div class='action'>
        <i class="fa-solid fa-pen edit-btn" style="cursor: pointer;"></i>
        <i class="fa-solid fa-x delete-btn" style="cursor: pointer;"></i>
      </div>
      <input type="checkbox" class="defChecker" style="cursor: pointer;" />
    </div>
  `;

  // Удаление карточки
  const deleteBtn = newCard.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    payCardsContainer.removeChild(newCard);
  });

  // Редактирование карточки
  const editBtn = newCard.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    cardToEdit = newCard; // Установить текущую карту для редактирования
    const cardInfo = newCard.querySelector(".card__info");
    const [name, cardNumber, expiry] = cardInfo.querySelectorAll("p");
    nameInputField.value = name.querySelector("i").textContent;
    cardNumberField.value = cardNumber.textContent.replace(/[^\d]/g, "");
    cardExpiryField.value = expiry.querySelector("i").textContent;
    createCardForm.style.display = "block";
  });

  // Логика для чекбокса "Default"
  const def = newCard.querySelector(".defChecker");
  def.addEventListener("click", (e) => {
    const cardInfo = newCard.querySelector(".card__info");

    // Сброс всех других чекбоксов и удаление <p>Default</p>
    document.querySelectorAll(".pay__card").forEach((item) => {
      const otherCheckbox = item.querySelector(".defChecker");
      const otherDefaultText = item.querySelector(".default-text");

      if (otherCheckbox && otherCheckbox !== def) {
        otherCheckbox.checked = false;
      }

      if (otherDefaultText && item !== newCard) {
        otherDefaultText.remove();
      }
    });

    // Добавление <p>Default</p> в текущую карточку
    if (e.target.checked) {
      const defaultText = document.createElement("p");
      defaultText.textContent = "Default";
      defaultText.classList.add("default-text");
      cardInfo.appendChild(defaultText);
    } else {
      const defaultText = cardInfo.querySelector(".default-text");
      if (defaultText) defaultText.remove();
    }
  });

  // Добавление карты в список
  payCardsContainer.insertBefore(newCard, addCardButton);

  // Сброс формы и скрытие
  createCardForm.style.display = "none";
  clearForm();
});

// Функция для очистки формы
function clearForm() {
  nameInputField.value = "";
  cardNumberField.value = "";
  cardExpiryField.value = "";
  cardCVVField.value = "";
}
