document.addEventListener('DOMContentLoaded', () => {

    // --- Credentials (CHANGE THESE TO YOUR OWN) ---
    const ADMIN_USER = 'yatan sagar';
    const ADMIN_PASS = 'karma2025';

    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const addTileContainer = document.getElementById('add-tile-container');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const addTileForm = document.getElementById('add-tile-form');
    const tableHeaderRow = document.getElementById('table-header-row');
    const tileList = document.getElementById('tile-list');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    // --- Application State ---
    let tiles = JSON.parse(localStorage.getItem('karmaTiles')) || [];
    let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // --- Main Functions ---

    /**
     * Renders the table based on current search, sort, and login state.
     */
    const renderTable = () => {
        // 1. Set table headers based on login state
        tableHeaderRow.innerHTML = `
            <th>Name</th>
            <th>Series</th>
            <th>Type</th>
            <th>Size</th>
            <th>Pieces/Box</th>
            <th>Price (₹/sq.ft)</th>
            ${isLoggedIn ? '<th>Actions</th>' : ''} 
        `;

        // 2. Filter and sort the data
        const searchTerm = searchInput.value.toLowerCase();
        let processedTiles = tiles.filter(tile => 
            tile.name.toLowerCase().includes(searchTerm) || 
            tile.series.toLowerCase().includes(searchTerm)
        );
        
        // Sorting logic
        switch(sortSelect.value) {
            case 'name-az': processedTiles.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-za': processedTiles.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'price-lh': processedTiles.sort((a, b) => a.price - b.price); break;
            case 'price-hl': processedTiles.sort((a, b) => b.price - a.price); break;
        }

        // 3. Render the table rows
        tileList.innerHTML = '';
        if (processedTiles.length === 0) {
            const colCount = isLoggedIn ? 7 : 6;
            tileList.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center;">No tiles found.</td></tr>`;
            return;
        }

        processedTiles.forEach(tile => {
            const row = document.createElement('tr');
            const deleteButtonHTML = isLoggedIn ? `<td><button class="delete-btn" data-id="${tile.id}">Delete</button></td>` : '';
            row.innerHTML = `
                <td>${tile.name}</td>
                <td>${tile.series}</td>
                <td>${tile.type}</td>
                <td>${tile.size}</td>
                <td>${tile.pieces}</td>
                <td>₹${parseFloat(tile.price).toFixed(2)}</td>
                ${deleteButtonHTML}
            `;
            tileList.appendChild(row);
        });
    };

    /**
     * Updates the entire UI based on whether the user is logged in.
     */
    const updateUI = () => {
        if (isLoggedIn) {
            loginContainer.classList.add('hidden');
            addTileContainer.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginContainer.classList.remove('hidden');
            addTileContainer.classList.add('hidden');
            logoutBtn.classList.add('hidden');
        }
        renderTable(); // Re-render the table to show/hide the "Actions" column
    };
    
    // --- Event Handler Functions ---
    
    const handleLogin = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            isLoggedIn = true;
            sessionStorage.setItem('isLoggedIn', 'true');
            updateUI();
        } else {
            alert('Incorrect username or password.');
        }
    };

    const handleLogout = () => {
        isLoggedIn = false;
        sessionStorage.removeItem('isLoggedIn');
        loginForm.reset();
        updateUI();
    };

    const handleAddTile = (e) => {
        e.preventDefault();
        const newTile = {
            id: Date.now(),
            name: document.getElementById('tile-name').value.trim(),
            series: document.getElementById('tile-series').value.trim(),
            type: document.getElementById('tile-type').value.trim(),
            size: document.getElementById('tile-size').value.trim(),
            pieces: document.getElementById('tile-pieces').value,
            price: document.getElementById('tile-price').value
        };
        tiles.push(newTile);
        localStorage.setItem('karmaTiles', JSON.stringify(tiles));
        renderTable();
        addTileForm.reset();
    };

    const handleDeleteTile = (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const idToDelete = parseInt(e.target.dataset.id);
            if (confirm('Are you sure you want to delete this tile?')) {
                tiles = tiles.filter(tile => tile.id !== idToDelete);
                localStorage.setItem('karmaTiles', JSON.stringify(tiles));
                renderTable();
            }
        }
    };
    
    // --- Event Listeners ---
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    addTileForm.addEventListener('submit', handleAddTile);
    tileList.addEventListener('click', handleDeleteTile);
    searchInput.addEventListener('input', renderTable);
    sortSelect.addEventListener('change', renderTable);

    // --- Initial Page Load ---
    updateUI();
});