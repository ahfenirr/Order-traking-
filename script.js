const orders = JSON.parse(localStorage.getItem('orders')) || [];

const pictureInput = document.getElementById('picture');
const sizeInput = document.getElementById('size');
const quantityInput = document.getElementById('quantity');
const categoryInput = document.getElementById('category');
const saveOrderButton = document.getElementById('saveOrder');
const ordersContainer = document.getElementById('orders');
const searchInput = document.getElementById('search');
const categoriesList = document.getElementById('categories');

function generateCode() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function renderOrders(filterCategory = 'all', searchQuery = '') {
  ordersContainer.innerHTML = '';
  const filteredOrders = orders.filter(order => {
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    const matchesSearch = order.code.includes(searchQuery) || order.size.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filteredOrders.forEach(order => {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order';

    orderDiv.innerHTML = `
      <img src="${order.picture}" alt="Product Image">
      <span><strong>${order.code}</strong> - Size: ${order.size}, Qty: ${order.quantity}, Category: ${order.category}</span>
      <button class="delete-btn" data-code="${order.code}">Delete</button>
    `;

    ordersContainer.appendChild(orderDiv);
  });

  // Add delete functionality
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const code = button.getAttribute('data-code');
      deleteOrder(code);
    });
  });
}

function saveOrder() {
  const pictureFile = pictureInput.files[0];
  const size = sizeInput.value.trim();
  const quantity = quantityInput.value.trim();
  const category = categoryInput.value;

  if (!pictureFile || !size || !quantity || !category) {
    alert('Please fill all fields.');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const pictureBase64 = reader.result;
    const code = generateCode();

    const newOrder = {
      code,
      picture: pictureBase64,
      size,
      quantity,
      category
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    renderOrders();

    pictureInput.value = '';
    sizeInput.value = '';
    quantityInput.value = '';
    categoryInput.value = '';
    alert(`Order saved with code: ${code}`);
  };

  reader.readAsDataURL(pictureFile);
}

function deleteOrder(code) {
  const index = orders.findIndex(order => order.code === code);
  if (index !== -1) {
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    alert(`Order with code ${code} deleted.`);
  }
}

function handleCategoryClick(event) {
  const selectedCategory = event.target.getAttribute('data-category');
  renderOrders(selectedCategory, searchInput.value.trim());
}

saveOrderButton.addEventListener('click', saveOrder);
searchInput.addEventListener('input', () => {
  renderOrders(document.querySelector('#categories li.selected')?.getAttribute('data-category') || 'all', searchInput.value.trim());
});

categoriesList.addEventListener('click', event => {
  if (event.target.tagName === 'LI') {
    document.querySelectorAll('#categories li').forEach(li => li.classList.remove('selected'));
    event.target.classList.add('selected');
    handleCategoryClick(event);
  }
});

// Initial render
renderOrders();
