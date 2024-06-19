
document.getElementById('newProductForm').addEventListener('submit', function(event) {
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    // Check for negative values
    if (price < 0) {
        alert('Price must be a positive number.');
        event.preventDefault();
        return;
    }

    if (quantity < 0) {
        alert('Quantity must be a positive integer.');
        event.preventDefault();
        return;
    }
});
