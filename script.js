const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

// Simulated AI responses for general chat
const aiResponses = {
  hello: "Hey there! Nice to see you. What do you want to talk about?",
  hi: "Hi! I’m Arena AI, ready to chat. What’s up?",
  how: "I’m doing great, thanks for asking! How about you?",
  what: "I’m here to help! What do you want to know or talk about?",
  bye: "Catch you later! Stay awesome!",
  default: "Hmm, I’m not sure about that. Try asking for a crypto price, the top 100 tokens, or about Arena X!"
};

// Information about Arena X
const arenaXInfo = `
Arena X is a decentralized social media platform focused on SocialFi, combining social networking with cryptocurrency. 
It’s the largest SocialFi app on Avalanche, the second-largest by Total Value Locked (TVL), and the #1 SocialFi app by public engagement. 
Creators can connect with their audience, monetize content, and earn more through features like trading tickets (shares), tipping, and exclusive communities. 
Users can financially and socially invest in their favorite influencers. The native token, $ARENA, powers the ecosystem.
`;

// Responses for human feelings
const feelingsResponses = {
  happy: "That’s awesome to hear! What’s got you in such a great mood?",
  sad: "I’m sorry you’re feeling sad. Want to share what’s on your mind? I’m here for you.",
  angry: "Sounds like you’re pretty upset. Care to vent or talk it out?",
  anxious: "Feeling anxious can be tough. Want to tell me more? Maybe we can sort through it together.",
  excited: "Woohoo, your excitement is contagious! What’s got you so pumped?",
  tired: "Feeling tired, huh? Maybe a quick chat about something fun can perk you up!",
  confused: "No worries, confusion happens! Want to explain what’s puzzling you?",
  scared: "I’m here for you. What’s got you feeling scared? Let’s talk it through."
};

// Function to add a message to the chat box
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Function to fetch a specific crypto price from CoinGecko
async function fetchCryptoPrice(tokenName) {
  // Map common token names to CoinGecko IDs
  const tokenMap = {
    bitcoin: 'bitcoin',
    btc: 'bitcoin',
    ethereum: 'ethereum',
    eth: 'ethereum',
    ripple: 'ripple',
    xrp: 'ripple',
    dogecoin: 'dogecoin',
    doge: 'dogecoin',
    tether: 'tether',
    usdt: 'tether',
    cardano: 'cardano',
    ada: 'cardano',
    solana: 'solana',
    sol: 'solana',
    arena: 'the-arena', // $ARENA token (The Arena)
    $arena: 'the-arena'
    
  };

  const tokenId = tokenMap[tokenName.toLowerCase()];
  if (!tokenId) {
    return `I don’t recognize that token (${tokenName}). Try Bitcoin, Ethereum, ARENA, or another popular token!`;
  }

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    const data = await response.json();

    if (data[tokenId] && data[tokenId].usd) {
      const tokenDisplayName = tokenName.toLowerCase().startsWith('$') ? tokenName : tokenName.charAt(0).toUpperCase() + tokenName.slice(1);
      return `The price of ${tokenDisplayName} is $${data[tokenId].usd} USD.`;
    } else {
      return `I couldn’t fetch the price for ${tokenName}. It might not be listed on CoinGecko.`;
    }
  } catch (error) {
    return `Sorry, I couldn’t fetch the price for ${tokenName} right now. Try again later!`;
  }
}

// Function to fetch the top 100 crypto prices from CoinGecko
async function fetchTop100CryptoPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    const data = await response.json();

    if (data && Array.isArray(data)) {
      let message = "Here are the top 100 cryptocurrencies by market cap:\n";
      data.forEach((coin, index) => {
        message += `${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price} USD\n`;
      });
      return message;
    } else {
      return "I couldn’t fetch the top 100 crypto prices right now. Try again later!";
    }
  } catch (error) {
    return "Sorry, I couldn’t fetch the top 100 crypto prices right now. Try again later!";
  }
}

// Function to determine if the message is a crypto price query
function isCryptoPriceQuery(message) {
  const lowerMessage = message.toLowerCase();
  return (lowerMessage.includes('price') || lowerMessage.includes('value')) &&
         (lowerMessage.includes('bitcoin') || lowerMessage.includes('btc') ||
          lowerMessage.includes('ethereum') || lowerMessage.includes('eth') ||
          lowerMessage.includes('ripple') || lowerMessage.includes('xrp') ||
          lowerMessage.includes('dogecoin') || lowerMessage.includes('doge') ||
          lowerMessage.includes('tether') || lowerMessage.includes('usdt') ||
          lowerMessage.includes('cardano') || lowerMessage.includes('ada') ||
          lowerMessage.includes('solana') || lowerMessage.includes('sol') ||
          lowerMessage.includes('arena') || lowerMessage.includes('$arena'));
}

// Function to extract token name from message
function extractTokenName(message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('bitcoin') || lowerMessage.includes('btc')) return 'bitcoin';
  if (lowerMessage.includes('ethereum') || lowerMessage.includes('eth')) return 'ethereum';
  if (lowerMessage.includes('ripple') || lowerMessage.includes('xrp')) return 'ripple';
  if (lowerMessage.includes('dogecoin') || lowerMessage.includes('doge')) return 'dogecoin';
  if (lowerMessage.includes('tether') || lowerMessage.includes('usdt')) return 'tether';
  if (lowerMessage.includes('cardano') || lowerMessage.includes('ada')) return 'cardano';
  if (lowerMessage.includes('solana') || lowerMessage.includes('sol')) return 'solana';
  if (lowerMessage.includes('arena') || lowerMessage.includes('$arena')) return 'arena';
  return null;
}

// Function to check if the user is asking for top 100 crypto prices
function isTop100Query(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('top 100') && (lowerMessage.includes('crypto') || lowerMessage.includes('token') || lowerMessage.includes('coin'));
}

// Function to check if the user is asking about Arena X
function isArenaXQuery(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('arena x') || lowerMessage.includes('arena project') || lowerMessage.includes('about arena');
}

// Function to simulate AI response
async function getAIResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Check if it’s a query about Arena X
  if (isArenaXQuery(message)) {
    return arenaXInfo;
  }

  // Check if it’s a top 100 crypto prices query
  if (isTop100Query(message)) {
    return await fetchTop100CryptoPrices();
  }

  // Check if it’s a crypto price query
  if (isCryptoPriceQuery(message)) {
    const tokenName = extractTokenName(message);
    if (tokenName) {
      return await fetchCryptoPrice(tokenName);
    }
  }

  // Handle general chat responses
  if (message.includes('hello')) return aiResponses.hello;
  if (message.includes('hi')) return aiResponses.hi;
  if (message.includes('how')) return aiResponses.how;
  if (message.includes('what')) return aiResponses.what;
  if (message.includes('bye')) return aiResponses.bye;
  return aiResponses.default;
}

// Function to handle sending a message
async function sendMessage() {
  const userMessage = userInput.value;
  if (!userMessage.trim()) return; // Ignore empty messages

  // Add user's message to chat
  addMessage(userMessage, true);

  // Get and add AI response
  const aiResponse = await getAIResponse(userMessage);
  setTimeout(() => addMessage(aiResponse), 500); // Simulate typing delay

  // Clear input
  userInput.value = '';
}

// Allow pressing Enter to send message
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});