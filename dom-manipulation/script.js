const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; 


let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Purpose" },
  { text: "Get busy living or get busy dying.", category: "Motivation" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}


function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}


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

function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <button id="exportJsonButton">Export Quotes as JSON</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;


  document.body.appendChild(formContainer);


  document.getElementById('exportJsonButton').addEventListener('click', exportToJson);
}

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


function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}


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

  // Simulate conflict detection
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
