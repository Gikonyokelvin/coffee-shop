document.addEventListener('DOMContentLoaded', () => {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
        const coffeeMenu = data.coffees;
        const tbody = document.querySelector('tbody');

        coffeeMenu.forEach(coffee => {
            const row = document.createElement('tr');
            
            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = coffee.image;
            img.alt = coffee.name;
            img.width = 50;
            img.height = 50;
            imgCell.appendChild(img);

            const nameCell = document.createElement('td');
            nameCell.textContent = coffee.name;
    
            const priceCell = document.createElement('td');
            priceCell.textContent = coffee.price;
    
            row.appendChild(imgCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
    
            tbody.appendChild(row);
        });
        })
        .catch(error => console.error('Error fetching coffee menu:', error));
    });
