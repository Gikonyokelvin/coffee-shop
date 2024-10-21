document.addEventListener('DOMContentLoaded', () => {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const coffeeMenu = data.coffees;
            const tbody = document.querySelector('tbody');
            const orderSummary = document.getElementById('order-summary');
            const totalElement = document.getElementById('total');
            let total = 0;
            let orderItems = {};

            coffeeMenu.forEach(coffee => {
                const row = document.createElement('tr');
                
                const imgCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = coffee.image;
                img.alt = coffee.name;
                img.width = 50;
                img.height = 50;
                img.classList.add('coffee-img');
                imgCell.appendChild(img);

                const nameCell = document.createElement('td');
                nameCell.textContent = coffee.name;
        
                const priceCell = document.createElement('td');
                priceCell.textContent = `$${coffee.price.toFixed(2)}`;
        
                row.appendChild(imgCell);
                row.appendChild(nameCell);
                row.appendChild(priceCell);
    
                // Add event listener to the row
                row.addEventListener('click', () => {
                    if (orderItems[coffee.name]) {
                        orderItems[coffee.name].quantity += 1;
                    } else {
                        orderItems[coffee.name] = {
                            price: coffee.price,
                            quantity: 1
                        };
                    }
                    updateOrderSummary();
                });

                tbody.appendChild(row);
            });

            function updateOrderSummary() {
                orderSummary.innerHTML = '';
                total = 0;

                Object.keys(orderItems).forEach(coffeeName => {
                    const item = orderItems[coffeeName];
                    total += item.price * item.quantity;

                    const listItem = document.createElement('li');
                    listItem.textContent = `${coffeeName} - $${item.price.toFixed(2)} x ${item.quantity}`;

                    // Add minus (delete) button
                    const minusButton = document.createElement('button');
                    minusButton.textContent = '-';
                    minusButton.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');

                    minusButton.addEventListener('click', () => {
                        removeItem(coffeeName);
                    });

                    listItem.appendChild(minusButton);
                    orderSummary.appendChild(listItem);
                });

                totalElement.textContent = total.toFixed(2);
            }

            function removeItem(coffeeName) {
                if (orderItems[coffeeName].quantity > 1) {
                    orderItems[coffeeName].quantity -= 1; // Decrease quantity
                } else {
                    delete orderItems[coffeeName]; // Remove item if quantity is 0
                }
                updateOrderSummary(); // Recalculate and update the summary
            }
        })
        .catch(error => console.error('Error fetching coffee menu:', error));
    // Handle order button click
    const orderButton = document.getElementById('order');
    orderButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        
        // Get customer name and phone number
        const customerName = document.getElementById('customer-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        
        if (customerName && phoneNumber) {
            // Show flash message
            const flashMessage = document.getElementById('flash-message');
            flashMessage.textContent = `Thank you, ${customerName}! Your order will be ready in 15 minutes.`;
            flashMessage.style.display = 'block';

            // Clear input fields
            document.getElementById('customer-name').value = '';
            document.getElementById('phone-number').value = '';

            // Clear the order summary
            document.getElementById('order-summary').innerHTML = '';

            // Clear the total
            document.getElementById('total').textContent = '0.00';

            // Hide the flash message after 3 seconds
            setTimeout(() => {
                flashMessage.style.opacity = 0; // Fade out
                setTimeout(() => flashMessage.style.display = 'none', 500); // Hide after fade out
            }, 5000); // 3000ms = 3 seconds
        }
    });
});