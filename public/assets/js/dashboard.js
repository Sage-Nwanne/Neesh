document.addEventListener('DOMContentLoaded', function() {
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    const searchBtn = document.getElementById('searchBtn');
    const sortBtn = document.getElementById('sortBtn');
    const filterBtn = document.getElementById('filterBtn');
    
    const searchBar = document.getElementById('searchBar');
    const sortOptions = document.getElementById('sortOptions');
    const filterOptions = document.getElementById('filterOptions');
    
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const typeFilters = document.querySelectorAll('.typeFilter');
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    
    const collection = document.querySelector('.collection');
    const cards = Array.from(collection.querySelectorAll('.product-card'));
    
    let currentView = 'grid'; // grid or list
    let currentSort = 'newest';
    let currentFilters = {
        search: '',
        genre: '',
        types: []
    };
    
    // View Toggle
    viewToggleBtn.addEventListener('click', function() {
        currentView = currentView === 'grid' ? 'list' : 'grid';
        if (currentView === 'list') {
            collection.style.display = 'flex';
            collection.style.flexDirection = 'column';
            cards.forEach(card => {
                card.style.maxWidth = '100%';
                card.style.flex = '1 1 100%';
            });
        } else {
            collection.style.display = 'flex';
            collection.style.flexDirection = 'row';
            collection.style.flexWrap = 'wrap';
            cards.forEach(card => {
                card.style.maxWidth = 'calc(16.66% - 20px)';
                card.style.flex = '1 1 calc(16.66% - 20px)';
            });
        }
    });
    
    // Search Toggle
    searchBtn.addEventListener('click', function() {
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        if (searchBar.style.display === 'block') {
            searchInput.focus();
        }
    });
    
    // Sort Toggle
    sortBtn.addEventListener('click', function() {
        sortOptions.style.display = sortOptions.style.display === 'none' ? 'block' : 'none';
    });
    
    // Filter Toggle
    filterBtn.addEventListener('click', function() {
        filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        currentFilters.search = this.value.toLowerCase();
        applyFiltersAndSort();
    });
    
    // Genre filter
    genreFilter.addEventListener('change', function() {
        currentFilters.genre = this.value;
        applyFiltersAndSort();
    });
    
    // Type filters
    typeFilters.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            currentFilters.types = Array.from(typeFilters)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            applyFiltersAndSort();
        });
    });
    
    // Sort functionality
    sortRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentSort = this.value;
            applyFiltersAndSort();
        });
    });
    
    function applyFiltersAndSort() {
        // Filter cards
        let filteredCards = cards.filter(card => {
            const title = card.querySelector('.product_title').textContent.toLowerCase();
            const genre = card.querySelector('.product_vendor').textContent.toLowerCase();
            const type = card.dataset.type || '';
            
            // Search filter
            if (currentFilters.search && !title.includes(currentFilters.search)) {
                return false;
            }
            
            // Genre filter
            if (currentFilters.genre && !genre.includes(currentFilters.genre.toLowerCase())) {
                return false;
            }
            
            // Type filter
            if (currentFilters.types.length > 0 && !currentFilters.types.includes(type)) {
                return false;
            }
            
            return true;
        });
        
        // Sort cards
        filteredCards.sort((a, b) => {
            const titleA = a.querySelector('.product_title').textContent;
            const titleB = b.querySelector('.product_title').textContent;
            const priceA = parseFloat(a.querySelector('.product_price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product_price').textContent.replace('$', ''));
            const dateA = new Date(a.dataset.created || 0);
            const dateB = new Date(b.dataset.created || 0);
            
            switch(currentSort) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'title-asc':
                    return titleA.localeCompare(titleB);
                case 'title-desc':
                    return titleB.localeCompare(titleA);
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });
        
        // Update display
        collection.innerHTML = '';
        if (filteredCards.length === 0) {
            collection.innerHTML = '<p style="width: 100%; text-align: center; padding: 40px;">No magazines match your filters.</p>';
        } else {
            filteredCards.forEach(card => {
                collection.appendChild(card);
            });
        }
    }
});

