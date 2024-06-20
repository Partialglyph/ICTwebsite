let scrollInterval;
let scrollSpeed = 5; // Default scroll speed

// Function to load the selected PDF into the iframe
function loadPDF(pdfFile) {
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        pdfViewer.src = pdfFile;
    } else {
        console.error('pdfViewer element not found');
    }
}

// Function to start scrolling the PDF
function startScrolling() {
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        scrollInterval = setInterval(() => {
            pdfViewer.contentWindow.scrollBy(0, scrollSpeed);
        }, 100);
    } else {
        console.error('pdfViewer element not found');
    }
}

// Function to stop scrolling the PDF
function stopScrolling() {
    clearInterval(scrollInterval);
}

// Function to adjust the scroll speed
function adjustScrollSpeed(speed) {
    scrollSpeed = parseInt(speed, 10);
}

// Function to apply saved settings
function applySettings() {
    const darkMode = localStorage.getItem('darkMode');
    const altFont = localStorage.getItem('altFont');
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    if (altFont === 'enabled') {
        document.body.classList.add('alt-font');
    }
}

// Function to navigate to the home page
function goHome() {
    window.location.href = 'index.html';
}

// Function to generate suggestions based on search term
function generateSuggestions(searchTerm) {
    const suggestionsList = document.getElementById('suggestions');
    if (!suggestionsList) {
        console.error('suggestions element not found');
        return;
    }
    suggestionsList.innerHTML = '';

    const sections = ['Mission Control', 'Sheet Music Tools', 'Text Editor', 'Gallery'];

    sections.forEach(section => {
        if (section.toLowerCase().includes(searchTerm.toLowerCase())) {
            const listItem = document.createElement('li');
            listItem.textContent = section;
            listItem.addEventListener('click', () => {
                navigateToSection(section);
            });
            suggestionsList.appendChild(listItem);
        }
    });

    // Adjust suggestions box width to match search bar
    const searchInput = document.getElementById('search');
    if (searchInput) {
        suggestionsList.style.width = searchInput.offsetWidth + 'px';
    } else {
        console.error('search element not found');
    }

    // Show the suggestions list with a soft animation
    if (suggestionsList.children.length > 0) {
        suggestionsList.classList.add('visible');
        suggestionsList.classList.remove('hidden');
    } else {
        suggestionsList.classList.add('hidden');
        suggestionsList.classList.remove('visible');
    }
}

// Function to navigate to a section
function navigateToSection(section) {
    const sectionMap = {
        'Mission Control': 'section1.html',
        'Sheet Music Tools': 'section2.html',
        'Text Editor': 'section3.html',
        'Gallery': 'gallery.html'
    };

    const targetPage = sectionMap[section];
    if (targetPage) {
        window.location.href = targetPage;
    } else {
        shakeSearchBar();
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = '';
        }
        const suggestionsList = document.getElementById('suggestions');
        if (suggestionsList) {
            suggestionsList.classList.add('hidden');
        }
    }
}

// Function to handle enter key on search input
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        const suggestionsList = document.getElementById('suggestions');
        if (suggestionsList && suggestionsList.children.length > 0) {
            navigateToSection(suggestionsList.children[0].textContent);
        } else {
            shakeSearchBar();
            event.target.value = '';
        }
    }
}

// Function to shake the search bar
function shakeSearchBar() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.classList.add('shake');
        setTimeout(() => {
            searchInput.classList.remove('shake');
        }, 500);
    } else {
        console.error('search element not found');
    }
}

// Function to get a random emoji
function getRandomEmoji() {
    const emojis = ['😀', '😂', '🤣', '😍', '😎', '🤩', '🥳', '😜', '🤪', '🤓'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// Function to set a random emoji cursor
function setRandomEmojiCursor() {
    const emoji = getRandomEmoji();
    document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><text y="32" font-size="32">${emoji}</text></svg>') 16 16, auto`;
}

// Function to handle file uploads for gallery
function handleFileUpload(event) {
    const files = event.target.files;
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) {
        console.error('galleryContainer element not found');
        return;
    }
    galleryContainer.innerHTML = ''; // Clear existing images

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            galleryContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Apply settings on page load
applySettings();

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontToggle = document.getElementById('fontToggle');
    const pdfSelector = document.getElementById('pdfSelector');
    const searchInput = document.getElementById('search');
    const suggestionsList = document.getElementById('suggestions');
    const fileInput = document.getElementById('fileInput');
    const emojiCursorButton = document.getElementById('emojiCursorButton');
    const scrollSpeedControl = document.getElementById('scrollSpeed');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const darkMode = document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled';
            localStorage.setItem('darkMode', darkMode);
        });
    }

    if (fontToggle) {
        fontToggle.addEventListener('click', () => {
            document.body.classList.toggle('alt-font');
            const altFont = document.body.classList.contains('alt-font') ? 'enabled' : 'disabled';
            localStorage.setItem('altFont', altFont);
        });
    }

    if (pdfSelector) {
        // Load the selected PDF when the selection changes
        pdfSelector.addEventListener('change', () => {
            loadPDF(pdfSelector.value);
        });
        
        // Load the default selected PDF on page load
        loadPDF(pdfSelector.value);
    }

    // Adjust the scroll speed when the range input changes
    if (scrollSpeedControl) {
        scrollSpeedControl.addEventListener('input', () => {
            adjustScrollSpeed(scrollSpeedControl.value);
        });
    }

    // Add event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim();
            generateSuggestions(searchTerm);
        });

        // Add keydown listener for Enter key
        searchInput.addEventListener('keydown', handleKeyDown);

        // Clear suggestions when search bar loses focus
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsList.classList.add('hidden');
                suggestionsList.classList.remove('visible');
            }, 100); // Small delay to allow click event on suggestions
        });
    }

    // Add event listener for file input in gallery
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Add event listener for emoji cursor button
    if (emojiCursorButton) {
        emojiCursorButton.addEventListener('click', setRandomEmojiCursor);
    }
});
