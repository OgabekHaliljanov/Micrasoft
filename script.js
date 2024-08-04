document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutButton = document.getElementById('checkout');
    const orderForm = document.getElementById('order-form');

    // Обработчик кнопок "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.closest('.product');
            const productId = productElement.getAttribute('data-id');
            const productName = productElement.querySelector('h2').textContent;
            const productPrice = productElement.querySelector('p').textContent;

            // Проверка, если товар уже в корзине
            const existingItemIndex = cartItems.findIndex(item => item.id === productId);
            if (existingItemIndex === -1) {
                cartItems.push({ id: productId, name: productName, price: productPrice });
            } else {
                alert('Этот товар уже добавлен в корзину');
            }
            updateCart();
        });
    });

    // Обработчик кнопки "Оформить заказ"
    checkoutButton.addEventListener('click', () => {
        document.getElementById('checkout-form').style.display = 'block';
    });

    // Обработчик отправки формы
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const patronymic = document.getElementById('patronymic').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // Формируем сообщение для отправки в Telegram
        let message = `Новый заказ:\n`;
        message += `Имя: ${name}\n`;
        message += `Фамилия: ${surname}\n`;
        message += `Отчество: ${patronymic}\n`;
        message += `Телефон: ${phone}\n`;
        message += `Адрес: ${address}\n\n`;
        message += `Корзина:\n`;
        cartItems.forEach(item => {
            message += `${item.name} - ${item.price}\n`;
        });

        // Отправляем сообщение в Telegram
        const botToken = '7361900889:AAG-Cg2BT820M45OuorjWwbLD1BP3WWl3fM'; // Замените YOUR_BOT_TOKEN на ваш токен
        const chatId = '-1002225333320'; // Замените YOUR_CHAT_ID на ID чата, куда отправлять сообщение
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });
            if (response.ok) {
                alert('Заказ оформлен и отправлен в Telegram!');
            } else {
                alert('Не удалось отправить сообщение в Telegram.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке сообщения в Telegram.');
        }

        // Очистка корзины и формы после отправки
        cartItems.length = 0;  // Очистка корзины
        updateCart();
        orderForm.reset();
        document.getElementById('checkout-form').style.display = 'none';
    });

    // Функция для обновления корзины
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - ${item.price}`;
            cartItemsContainer.appendChild(listItem);
        });
    }
});
