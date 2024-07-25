// Initial array of quotes
const quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Purpose" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initial quote display
  showRandomQuote();
  