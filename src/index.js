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
                    orderItems[coffeeName].quantity -= 1;
                } else {
                    delete orderItems[coffeeName];
                }
                updateOrderSummary();
            }

            // Comments Handling
            const commentList = document.getElementById('comment-list');
            const storedComments = JSON.parse(localStorage.getItem('comments')) || data.comments;

            // Load comments from localStorage or fallback to db.json
            storedComments.forEach(comment => {
                addCommentToDOM(comment);
            });

            // Add new comments
            const commentForm = document.getElementById('comment-form');
            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const commentText = document.getElementById('comment-text').value;
                if (commentText) {
                    const newComment = { id: Date.now(), text: commentText };

                    // Store comment in localStorage
                    storedComments.push(newComment);
                    localStorage.setItem('comments', JSON.stringify(storedComments));

                    addCommentToDOM(newComment);
                    document.getElementById('comment-text').value = ''; // Clear input
                }
            });

            // Function to add a comment to the DOM
            function addCommentToDOM(comment) {
                const listItem = document.createElement('li');
                listItem.textContent = comment.text;

                // Add delete button to each comment
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteComment(comment.id, listItem);
                });

                listItem.appendChild(deleteButton);
                commentList.appendChild(listItem);
            }

            // Delete comments from localStorage and DOM
            function deleteComment(commentId, listItem) {
                const commentIndex = storedComments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1) {
                    storedComments.splice(commentIndex, 1); // Remove comment from array
                    localStorage.setItem('comments', JSON.stringify(storedComments)); // Update localStorage
                    listItem.remove(); // Remove from DOM
                }
            }
        })
        .catch(error => console.error('Error fetching coffee menu and comments:', error));

    // Handle order button click
    const orderButton = document.getElementById('order');
    orderButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        const customerName = document.getElementById('customer-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        
        if (customerName && phoneNumber) {
            const flashMessage = document.getElementById('flash-message');
            flashMessage.textContent = `Thank you, ${customerName}! Your order will be ready in 15 minutes.`;
            flashMessage.style.display = 'block';

            document.getElementById('customer-name').value = '';
            document.getElementById('phone-number').value = '';
            document.getElementById('order-summary').innerHTML = '';
            document.getElementById('total').textContent = '0.00';

            setTimeout(() => {
                flashMessage.style.opacity = 0;
                setTimeout(() => flashMessage.style.display = 'none', 500);
            }, 5000);
        }
    });
});
