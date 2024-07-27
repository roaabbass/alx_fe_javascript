const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API endpoint

// Initialize quotes from local storage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Purpose" },
  { text: "Get busy living or get busy dying.", category: "Motivation" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes(); // Save quotes to local storage
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    populateCategories(); // Update category filter
    filterQuotes(); // Display quotes based on selected category
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <button id="exportJsonButton">Export Quotes as JSON</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;

  // Append the form to the body or a specific container
  document.body.appendChild(formContainer);

  // Add event listeners to the new buttons
  document.getElementById('exportJsonButton').addEventListener('click', exportToJson);
}

// Function to export quotes as JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.length = 0; // Clear existing quotes
    quotes.push(...importedQuotes); // Add imported quotes
    saveQuotes(); // Save updated quotes to local storage
    populateCategories(); // Update category filter
    filterQuotes(); // Display quotes based on selected category
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate categories in the filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set(quotes.map(quote => quote.category));
  categories.add('all'); // Add an option for 'All Categories'

  categoryFilter.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = 'No quotes available for this category.';
  } else {
    const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    const randomQuote = quotesToDisplay[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }
}

// Function to fetch data from the server
function fetchQuotesFromServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(data => {
      handleServerData(data);
    })
    .catch(error => console.error('Error fetching data from server:', error));
}


function handleServerData(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  
  const conflicts = serverQuotes.filter(serverQuote =>
    localQuotes.some(localQuote =>
      localQuote.text === serverQuote.title && localQuote.category !== serverQuote.category
    )
  );

  if (conflicts.length > 0) {
    notifyUser('Conflicts detected. Server data will be used.');
  }

  const updatedQuotes = serverQuotes.map(serverQuote => {
    const localQuote = localQuotes.find(lq => lq.text === serverQuote.title);
    return localQuote ? { ...localQuote, category: serverQuote.category } : { text: serverQuote.title, category: serverQuote.category };
  });

  const newQuotes = serverQuotes.filter(serverQuote =>
    !localQuotes.some(lq => lq.text === serverQuote.title)
  );

  const mergedQuotes = [...updatedQuotes, ...newQuotes];
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes.length = 0;
  quotes.push(...mergedQuotes);
  showRandomQuote(); // Update the displayed quote
}


function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'yellow';
  notification.style.padding = '10px';
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
}


document.getElementById('newQuote').addEventListener('click', () => {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  filterQuotes();
});

populateCategories();
const savedCategory = localStorage.getItem('selectedCategory') || 'all';
document.getElementById('categoryFilter').value = savedCategory;
filterQuotes();


setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
