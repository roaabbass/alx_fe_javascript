// Initialize quotes from local storage or default quotes
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
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

// Event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', () => {
const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
filterQuotes();
});

// Initialize categories and quotes on page load
populateCategories();
const savedCategory = localStorage.getItem('selectedCategory') || 'all';
document.getElementById('categoryFilter').value = savedCategory;
filterQuotes();
