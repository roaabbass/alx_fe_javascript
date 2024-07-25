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
      showRandomQuote(); // Display a new quote after adding
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
      showRandomQuote(); // Display a new random quote
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initial quote display
  showRandomQuote();
  
  // Create and display the form to add new quotes
  createAddQuoteForm();
  