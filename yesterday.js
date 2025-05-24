// Yesterday's Updates JavaScript

// Data storage
let tweetsData = [];
let newsData = [];
let currentFilters = { tweets: 'all', news: 'all' };

// Display yesterday's date
const yesterdayDateDisplay = document.getElementById('yesterdayDate');
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterdayDateDisplay.textContent = yesterday.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

// Initialize with sample data
const sampleTweets = [
    {
        id: 1,
        author: '@elonmusk',
        authorName: 'Elon Musk',
        content: 'Much appreciated on behalf of the @DOGE team',
        url: 'https://x.com/elonmusk/status/1926063893723369833',
        category: 'bullish',
        likes: 29000,
        retweets: 4400,
        timestamp: new Date(Date.now() - 86400000) // 24 hours ago
    },
    { 
        id: 2, 
        author: '@ArtCandee', 
        authorName: 'Art Candee', 
        content: 'Donald Trump, clearly big mad that the European Union signed a deal for the minerals in Greenland, is now threatening 50% tariffs on EU goods. Unhinged.<br><br>&nbsp;&nbsp;&nbsp;&nbsp;@realDonaldTrump:<br>&nbsp;&nbsp;&nbsp;&nbsp;The European Union, which was formed for the primary purpose of taking advantage of the United States on TRADE, has been very difficult to deal with. Their powerful Trade Barriers, Vat Taxes, ridiculous Corporate Penalties, Non-Monetary Trade Barriers, Monetary Manipulations, unfair and unjustified lawsuits against Americans Companies, and more, have led to a Trade Deficit with the U.S. of more than $250,000,000 a year, a number which is totally unacceptable. Our discussions with them are going nowhere! Therefore, I am recommending a straight 50% Tariff on the European Union, starting on June 1, 2025. There is no Tariff if the product is built or manufactured in the United States. Thank you for your attention to this matter',
        url: 'https://x.com/ArtCandee/status/1925884798855254351', 
        category: 'bearish', 
        likes: 3100, 
        retweets: 754, 
        timestamp: new Date(Date.now() - 72000000) 
    },
    {
        id: 3,
        author: '@realDonaldTrump',
        authorName: 'Donald Trump',
        content: 'THE ONE, BIG, BEAUTIFUL BILL” has PASSED the House of Representatives! This is arguably the most significant piece of Legislation that will ever be signed in the History of our Country! The Bill includes MASSIVE Tax CUTS, No Tax on Tips, No Tax on Overtime, Tax Deductions when you purchase an American Made Vehicle, along with strong Border Security measures, Pay Raises for our ICE and Border Patrol Agents, Funding for the Golden Dome, “TRUMP Savings Accounts” for newborn babies, and much more! Great job by Speaker Mike Johnson, and the House Leadership, and thank you to every Republican who voted YES on this Historic Bill! Now, it’s time for our friends in the United States Senate to get to work, and send this Bill to my desk AS SOON AS POSSIBLE! There is no time to waste. The Democrats have lost control of themselves, and are aimlessly wandering around, showing no confidence, grit, or determination. They have forgotten their landslide loss in the Presidential Election, and are warped in the past, hoping someday to revive Open Borders for the World’s criminals to be able to pour into our Country, men to be able to play in women’s sports, and transgender for everybody. They don’t realize that these things, and so many more like them, will NEVER AGAIN happen!',
        url: 'https://x.com/realDonaldTrump/status/1925548216243703820',
        category: 'bullish',
        likes: 334000,
        retweets: 54000,
        timestamp: new Date(Date.now() - 54000000)
    }
];

const sampleNews = [
    {
        id: 1,
        title: 'Kraken opening digital tokens of Apple, Tesla and Nvidia to people outside the U.S.',
        content: 'Kraken, a crypto exchange that has spent years in court battling charges brought by the U.S. Securities and Exchange Commission over its digital asset offerings, is preparing to offer tokenized securities, including shares of Apple, Tesla, and Nvidia, to customers outside the U.S, according to a release Thursday. The exchange is partnering with Backed—a firm specializing in blockchain-based financial assets — to offer more than 50 U.S. stocks and ETFs as tokens on the Solana blockchain, the release said. The product, called xStocks, will be available only to users outside the United States and will trade 24/7, much like bitcoin, allowing around-the-clock access to traditional equities in a crypto-native format, the release said.',
        source: 'CNBC',
        url: 'https://www.cnbc.com/2025/05/22/kraken-opening-digital-tokens-of-apple-tesla-and-nvidia-outside-us.html',
        category: 'defi',
        timestamp: new Date(Date.now() - 43200000)
    },
    {
        id: 2,
        title: 'Donald Trump Announces a Fresh Set of Tarrifs on The European Union',
        content: 'The European Union, which was formed for the primary purpose of taking advantage of the United States on TRADE, has been very difficult to deal with. Their powerful Trade Barriers, Vat Taxes, ridiculous Corporate Penalties, Non-Monetary Trade Barriers, Monetary Manipulations, unfair and unjustified lawsuits against Americans Companies, and more, have led to a Trade Deficit with the U.S. of more than $250,000,000 a year, a number which is totally unacceptable. Our discussions with them are going nowhere! Therefore, I am recommending a straight 50% Tariff on the European Union, starting on June 1, 2025. There is no Tariff if the product is built or manufactured in the United States. Thank you for your attention to this matter!',
        source: '@ArtCandee',
        url: 'https://x.com/ArtCandee/status/1925884798855254351',
        category: 'regulation',
        timestamp: new Date(Date.now() - 61200000)
    },
    {
        id: 3,
        title: 'Big Banks Explore Venturing Into Crypto World Together With Joint Stablecoin',
        content: 'The discussions involve payments companies co-owned by JPMorgan Chase, other large banks. The nation’s biggest banks are exploring whether to team up to issue a joint stablecoin, a step intended to fend off escalating competition from the cryptocurrency industry.',
        source: 'WSJ',
        url: 'https://www.wsj.com/finance/banking/crypto-stablecoin-big-banks-a841059e',
        category: 'exchange',
        timestamp: new Date(Date.now() - 32400000)
    },
    {
        id: 4,
        title: 'Big banks strike deal to move to solana blockchain',
        content: "What to know: R3, a U.K. developer of blockchain technology for financial institutions, is teaming up with the Solana Foundation to bring the former's clients and their tokenized real-world assets to Solana. R3 holds over $10 billion in assets and counts the likes of HSBC, Bank of America, Bank of Italy and the Monetary Authority of Singapore among its participants. R3's aim is to supercharge the scale and liquidity of the tokenized asset ecosystem by making the assets available on a public blockchain.",
        source: 'Coin Desk',
        url: 'https://www.coindesk.com/business/2025/05/22/major-tradfi-institutions-to-pursue-tokenization-efforts-on-solana',
        category: 'exchange',
        timestamp: new Date(Date.now() - 32400000)
    }
];

// Load data from localStorage or use samples
function loadData() {
    const savedTweets = localStorage.getItem('travaYesterdayTweets');
    const savedNews = localStorage.getItem('travaYesterdayNews');
    
    tweetsData = savedTweets ? JSON.parse(savedTweets) : sampleTweets;
    newsData = savedNews ? JSON.parse(savedNews) : sampleNews;
    
    // Convert timestamp strings back to Date objects
    tweetsData.forEach(tweet => {
        tweet.timestamp = new Date(tweet.timestamp);
    });
    newsData.forEach(news => {
        news.timestamp = new Date(news.timestamp);
    });
    
    renderTweets();
    renderNews();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('travaYesterdayTweets', JSON.stringify(tweetsData));
    localStorage.setItem('travaYesterdayNews', JSON.stringify(newsData));
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format time ago
function timeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours >= 24) {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    } else if (diffHours >= 1) {
        return `${diffHours}h ago`;
    } else {
        return `${diffMinutes}m ago`;
    }
}

// Get initials for avatar
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
}

// Render tweets
function renderTweets() {
    const container = document.getElementById('tweetsContainer');
    const filteredTweets = currentFilters.tweets === 'all' 
        ? tweetsData 
        : tweetsData.filter(tweet => tweet.category === currentFilters.tweets);
    
    if (filteredTweets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tweets found</h3>
                <p>No tweets match the current filter or none have been added yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTweets.map(tweet => `
        <div class="tweet-card" data-category="${tweet.category}">
            <div class="tweet-header">
                <div class="tweet-avatar">${getInitials(tweet.authorName)}</div>
                <div class="tweet-author-info">
                    <div class="tweet-author-name">${tweet.authorName}</div>
                    <div class="tweet-author-handle">${tweet.author}</div>
                </div>
                <div class="tweet-category-badge ${tweet.category}">${tweet.category}</div>
            </div>
            <div class="tweet-content">${tweet.content}</div>
            <div class="tweet-footer">
                <div class="tweet-stats">
                    <div class="tweet-stat">
                        <span>❤️</span>
                        <span>${formatNumber(tweet.likes)}</span>
                    </div>
                    <div class="tweet-stat">
                        <span>🔄</span>
                        <span>${formatNumber(tweet.retweets)}</span>
                    </div>
                    <div class="tweet-stat">
                        <span>⏰</span>
                        <span>${timeAgo(tweet.timestamp)}</span>
                    </div>
                </div>
                <a href="${tweet.url}" target="_blank" class="tweet-link">View Tweet</a>
            </div>
        </div>
    `).join('');
    
    document.getElementById('tweetsLastUpdated').textContent = 
        `${filteredTweets.length} tweet${filteredTweets.length !== 1 ? 's' : ''} • `;
}

// Render news
function renderNews() {
    const container = document.getElementById('newsContainer');
    const filteredNews = currentFilters.news === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === currentFilters.news);
    
    if (filteredNews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No news found</h3>
                <p>No news articles match the current filter or none have been added yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredNews.map(news => `
        <div class="news-card" data-category="${news.category}">
            <div class="news-header">
                <div class="news-title">${news.title}</div>
                <div class="news-category-badge ${news.category}">${news.category}</div>
            </div>
            <div class="news-content">${news.content}</div>
            <div class="news-footer">
                <div class="news-meta">
                    <div class="news-source">${news.source}</div>
                    <div class="news-time">${timeAgo(news.timestamp)}</div>
                </div>
                <a href="${news.url}" target="_blank" class="news-link">Read More</a>
            </div>
        </div>
    `).join('');
    
    document.getElementById('newsLastUpdated').textContent = 
        `${filteredNews.length} article${filteredNews.length !== 1 ? 's' : ''} • Manual updates`;
}

// Filter content
function filterContent(type, category) {
    currentFilters[type] = category;
    
    // Update active filter button
    const section = type === 'tweets' ? 
        document.querySelector('#tweetsContainer').parentElement : 
        document.querySelector('#newsContainer').parentElement;
    
    const buttons = section.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    if (type === 'tweets') {
        renderTweets();
    } else {
        renderNews();
    }
}

// Admin panel functions
function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Add tweet
document.getElementById('tweetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const tweet = {
        id: Date.now(),
        author: document.getElementById('tweetAuthor').value,
        authorName: document.getElementById('tweetAuthorName').value,
        content: document.getElementById('tweetContent').value,
        url: document.getElementById('tweetUrl').value,
        category: document.getElementById('tweetCategory').value,
        likes: parseInt(document.getElementById('tweetLikes').value) || 0,
        retweets: parseInt(document.getElementById('tweetRetweets').value) || 0,
        timestamp: new Date()
    };
    
    tweetsData.unshift(tweet); // Add to beginning
    saveData();
    renderTweets();
    e.target.reset();
    
    // Show success message
    alert('Tweet added successfully!');
});

// Add news
document.getElementById('newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const news = {
        id: Date.now(),
        title: document.getElementById('newsTitle').value,
        content: document.getElementById('newsContent').value,
        source: document.getElementById('newsSource').value,
        url: document.getElementById('newsUrl').value,
        category: document.getElementById('newsCategory').value,
        timestamp: new Date(document.getElementById('newsTime').value)
    };
    
    newsData.unshift(news); // Add to beginning
    saveData();
    renderNews();
    e.target.reset();
    
    // Show success message
    alert('News added successfully!');
});

// Delete tweet function
function deleteTweet(id) {
    if (confirm('Are you sure you want to delete this tweet?')) {
        tweetsData = tweetsData.filter(tweet => tweet.id !== id);
        saveData();
        renderTweets();
    }
}

// Delete news function
function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
        newsData = newsData.filter(news => news.id !== id);
        saveData();
        renderNews();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Set default datetime for news form to yesterday
    const newsTimeInput = document.getElementById('newsTime');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0); // Set to noon
    newsTimeInput.value = yesterday.toISOString().slice(0, 16);
});

// Export data function (for backup)
function exportData() {
    const data = {
        tweets: tweetsData,
        news: newsData,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trava-yesterday-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data function (for restore)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.tweets && data.news) {
                tweetsData = data.tweets.map(tweet => ({
                    ...tweet,
                    timestamp: new Date(tweet.timestamp)
                }));
                newsData = data.news.map(news => ({
                    ...news,
                    timestamp: new Date(news.timestamp)
                }));
                
                saveData();
                renderTweets();
                renderNews();
                alert('Data imported successfully!');
            } else {
                alert('Invalid file format!');
            }
        } catch (error) {
            alert('Error parsing file!');
        }
    };
    reader.readAsText(file);
}

// Add keyboard shortcuts for admin
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + A to toggle admin
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdmin();
    }
});

// Auto-save draft functionality
let draftTimer;

function saveDraft(type, formData) {
    const draftKey = `trava-${type}-draft`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
}

function loadDraft(type) {
    const draftKey = `trava-${type}-draft`;
    const draft = localStorage.getItem(draftKey);
    return draft ? JSON.parse(draft) : null;
}

function clearDraft(type) {
    const draftKey = `trava-${type}-draft`;
    localStorage.removeItem(draftKey);
}

// Add auto-save to forms
document.getElementById('tweetForm').addEventListener('input', (e) => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const formData = {
            author: document.getElementById('tweetAuthor').value,
            authorName: document.getElementById('tweetAuthorName').value,
            content: document.getElementById('tweetContent').value,
            url: document.getElementById('tweetUrl').value,
            category: document.getElementById('tweetCategory').value,
            likes: document.getElementById('tweetLikes').value,
            retweets: document.getElementById('tweetRetweets').value
        };
        saveDraft('tweet', formData);
    }, 1000);
});

document.getElementById('newsForm').addEventListener('input', (e) => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const formData = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            source: document.getElementById('newsSource').value,
            url: document.getElementById('newsUrl').value,
            category: document.getElementById('newsCategory').value,
            time: document.getElementById('newsTime').value
        };
        saveDraft('news', formData);
    }, 1000);
});

// Load drafts on page load
window.addEventListener('load', () => {
    const tweetDraft = loadDraft('tweet');
    if (tweetDraft) {
        Object.keys(tweetDraft).forEach(key => {
            const element = document.getElementById(`tweet${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element && tweetDraft[key]) {
                element.value = tweetDraft[key];
            }
        });
    }
    
    const newsDraft = loadDraft('news');
    if (newsDraft) {
        Object.keys(newsDraft).forEach(key => {
            const element = document.getElementById(`news${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element && newsDraft[key]) {
                element.value = newsDraft[key];
            }
        });
    }
});

// Clear drafts on successful submit
document.getElementById('tweetForm').addEventListener('submit', () => {
    clearDraft('tweet');
});

document.getElementById('newsForm').addEventListener('submit', () => {
    clearDraft('news');
});