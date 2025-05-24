// Check if DOM is available
if (typeof document === 'undefined') {
    console.error('DOM not available');
}

// Page navigation state
let currentPage = 'today';

// Global variables
let canvas, ctx, particles = [];
let mouseX = 0, mouseY = 0;
let userCoinAddresses = [];
let userCoinsData = [];
let trendingCoinsData = [];
let trendingLastUpdated = null;
let userCoinsLastUpdated = null;
let currentViews = { trending: 'cards', user: 'cards' };
let currentSort = { trending: 'default', user: 'default' };
let currentCoinData = null;

// Mock trending coins
const mockTrendingCoins = [
    '3d7AzmWfTWJMwAxpoxgZ4uSMmGVaaC6z2f73dP3Mpump', // POPCAT
    'b8cddvKBSj1Me9PgT7W9ps2zJymeRxzZdbdtCArpump', // BONK
    'Ak1StSUAardZ157jSQu4hMkkoPFiUowttuowUeompump', // PNUT
    'GNYLexaKyy7GHX8wiKVCmohNcuh6fvtrFkPsbVypump'  // GOAT
];

// Page navigation function
function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active-nav');
    }
    
    // Update footer text based on page
    const footerText = document.getElementById('footerPageName');
    if (footerText) {
        switch(pageName) {
            case 'today':
                footerText.textContent = 'Daily Memecoin Runners';
                break;
            case 'yesterday':
                footerText.textContent = "Yesterday's Updates";
                break;
            case 'roadmap':
                footerText.textContent = 'Coming Soon';
                break;
            default:
                footerText.textContent = 'Daily Memecoin Runners';
        }
    }
    
    // Update page title
    const pageTitles = {
        'today': 'TRAVA - Daily Memecoin Runners',
        'yesterday': "TRAVA - Yesterday's Updates", 
        'roadmap': 'TRAVA - Coming Soon'
    };
    document.title = pageTitles[pageName] || 'TRAVA - Daily Memecoin Runners';
    
    currentPage = pageName;
    
    // Initialize page-specific functionality
    if (pageName === 'yesterday' && typeof initializeYesterdayApp === 'function') {
        setTimeout(() => {
            initializeYesterdayApp();
        }, 100);
    }
    
    // Add animation for roadmap page progress bars
    if (pageName === 'roadmap') {
        setTimeout(() => {
            animateProgressBars();
        }, 300);
    }
}
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Setup navigation event listeners
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            if (pageName) {
                switchPage(pageName);
            }
        });
    });
}

// Initialize app function
function initializeApp() {
    // Check if required elements exist
    const requiredElements = [
        'particles',
        'dateDisplay', 
        'trendingContainer',
        'userCoinsContainer',
        'coinAddressInput'
    ];
    
    const missing = requiredElements.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
        console.error('Missing required elements:', missing);
        return false;
    }
    
    // Initialize particle background
    initParticles();
    
    // Display current date
    displayCurrentDate();
    
    // Set up event listeners
    setupEventListeners();
    
    // Setup page navigation
    setupNavigation();
    
    // Initialize with today page
    switchPage('today');
    
    // Initialize main app
    renderTrendingCoins();
    loadUserCoins();
    
    return true;
}

// Initialize particle background
function initParticles() {
    canvas = document.getElementById('particles');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = Math.random() > 0.5 ? '#3b82f6' : '#60a5fa';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (100 - distance) / 100;
                this.speedX -= forceDirectionX * force * 2;
                this.speedY -= forceDirectionY * force * 2;
            }

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Slow down
            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }

    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Display current date
function displayCurrentDate() {
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        const today = new Date();
        dateDisplay.textContent = today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Allow Enter key to add coin
    const coinInput = document.getElementById('coinAddressInput');
    if (coinInput) {
        coinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCoin();
            }
        });
    }

    // Close modal on overlay click
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                closeShareModal();
            }
        });
    }

    // Save coins when page unloads
    window.addEventListener('beforeunload', saveUserCoins);
}

// Fetch coin data from DexScreener API
async function fetchCoinData(address) {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
            // Get the pair with highest liquidity
            const bestPair = data.pairs.reduce((best, current) => {
                const currentLiquidity = current.liquidity?.usd || 0;
                const bestLiquidity = best.liquidity?.usd || 0;
                return currentLiquidity > bestLiquidity ? current : best;
            });

            return {
                name: bestPair.baseToken.name || 'Unknown',
                symbol: bestPair.baseToken.symbol || 'N/A',
                price: formatPrice(bestPair.priceUsd),
                gain: formatGain(bestPair.priceChange?.h24 || 0),
                volume: formatVolume(bestPair.volume?.h24 || 0),
                liquidity: formatVolume(bestPair.liquidity?.usd || 0),
                contract: address,
                chain: bestPair.chainId || 'Unknown',
                pairAddress: bestPair.pairAddress,
                dexScreenerUrl: bestPair.url
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching coin data:', error);
        return null;
    }
}

// Format price
function formatPrice(price) {
    if (!price || price === 0) return '$0.00';
    
    const num = parseFloat(price);
    if (num < 0.00001) {
        return `$${num.toExponential(4)}`;
    } else if (num < 1) {
        return `$${num.toFixed(8).replace(/\.?0+$/, '')}`;
    } else {
        return `$${num.toFixed(2)}`;
    }
}

// Format gain
function formatGain(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

// Format volume
function formatVolume(volume) {
    if (volume >= 1000000) {
        return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
        return `$${(volume / 1000).toFixed(1)}K`;
    } else {
        return `$${volume.toFixed(0)}`;
    }
}

// Sort coins function
function sortCoins(type, sortBy) {
    currentSort[type] = sortBy;
    let data = type === 'trending' ? trendingCoinsData : userCoinsData;
    
    if (sortBy === 'default') {
        renderCoins(type);
        return;
    }
    
    data.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return parseFloat(b.price.replace(/[$,]/g, '')) - parseFloat(a.price.replace(/[$,]/g, ''));
            case 'change':
                return parseFloat(b.gain.replace(/[%+]/g, '')) - parseFloat(a.gain.replace(/[%+]/g, ''));
            case 'volume':
                return parseVolume(b.volume) - parseVolume(a.volume);
            case 'liquidity':
                return parseVolume(b.liquidity) - parseVolume(a.liquidity);
            default:
                return 0;
        }
    });
    
    renderCoins(type);
}

// Parse volume string to number for sorting
function parseVolume(volumeStr) {
    if (!volumeStr) return 0;
    const num = parseFloat(volumeStr.replace(/[$,]/g, ''));
    if (volumeStr.includes('M')) return num * 1000000;
    if (volumeStr.includes('K')) return num * 1000;
    return num;
}

// Toggle view between cards and table
function toggleView(type, view) {
    currentViews[type] = view;
    
    const section = type === 'trending' ? document.querySelector('.trending-section') : document.querySelector('.search-section');
    if (section) {
        const buttons = section.querySelectorAll('.view-toggle button');
        buttons.forEach(btn => btn.classList.remove('active'));
        buttons.forEach(btn => {
            if ((view === 'cards' && btn.textContent === 'Cards') || 
                (view === 'table' && btn.textContent === 'Table')) {
                btn.classList.add('active');
            }
        });
    }
    
    renderCoins(type);
}

// Update last updated timestamp
function updateLastUpdated(type) {
    const now = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    if (type === 'trending') {
        trendingLastUpdated = now;
        const element = document.getElementById('trendingLastUpdated');
        if (element) element.textContent = `Last updated: ${now}`;
    } else {
        userCoinsLastUpdated = now;
        const element = document.getElementById('userCoinsLastUpdated');
        if (element) {
            if (userCoinsData.length > 0) {
                element.textContent = `Last updated: ${now}`;
            } else {
                element.textContent = 'No coins added';
            }
        }
    }
}

// Unified render function
function renderCoins(type) {
    if (type === 'trending') {
        renderTrendingCoins();
    } else {
        renderUserCoins();
    }
}

// Generate table HTML for coins
function generateTableHTML(coins, type) {
    const isUserCoins = type === 'user';
    
    return `
        <div class="table-container">
            <table class="coin-table">
                <thead>
                    <tr>
                        <th class="sortable" onclick="sortCoins('${type}', 'name')">Name</th>
                        <th class="sortable" onclick="sortCoins('${type}', 'price')">Price</th>
                        <th class="sortable" onclick="sortCoins('${type}', 'change')">24h Change</th>
                        <th class="sortable" onclick="sortCoins('${type}', 'volume')">Volume</th>
                        <th class="sortable" onclick="sortCoins('${type}', 'liquidity')">Liquidity</th>
                        <th>Chain</th>
                        <th>Contract</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${coins.map((coin, index) => `
                        <tr>
                            <td>
                                <div class="coin-info">
                                    <div>
                                        <div class="coin-name-cell">${coin.name}</div>
                                        <div class="coin-symbol-cell">${coin.symbol}</div>
                                        ${!isUserCoins ? '<div class="trending-indicator">Trending</div>' : ''}
                                    </div>
                                </div>
                            </td>
                            <td class="stat-value">${coin.price}</td>
                            <td class="stat-value ${parseFloat(coin.gain) >= 0 ? 'gain-positive' : 'gain-negative'}">${coin.gain}</td>
                            <td class="stat-value">${coin.volume}</td>
                            <td class="stat-value">${coin.liquidity}</td>
                            <td class="chain-cell">${coin.chain}</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 12px; color: #cbd5e1;">${formatAddress(coin.contract)}</span>
                                    <button class="copy-btn" onclick="copyContract('${coin.contract}', this)">Copy</button>
                                </div>
                            </td>
                            <td>
                                <div class="actions-cell">
                                    ${isUserCoins ? `<button class="table-remove-btn" onclick="removeCoin(${index})">Remove</button>` : ''}
                                    <button class="table-share-btn" onclick="openShareModal('${type}', ${index})">
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                                        </svg>
                                        Share
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Format address
function formatAddress(address) {
    if (address.length > 10) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
}

// Render trending coins
async function renderTrendingCoins() {
    const container = document.getElementById('trendingContainer');
    if (!container) return;
    
    // If we already have data and just switching views, don't reload
    if (trendingCoinsData.length > 0) {
        if (currentViews.trending === 'table') {
            container.innerHTML = generateTableHTML(trendingCoinsData, 'trending');
        } else {
            container.className = 'coin-grid';
            container.innerHTML = trendingCoinsData.map((coin, index) => `
                <div class="coin-card">
                    <div class="trending-badge">Trending</div>
                    <div class="coin-header">
                        <div>
                            <div class="coin-name">${coin.name}</div>
                            <div class="chain-name">${coin.chain}</div>
                        </div>
                        <div class="coin-symbol">${coin.symbol}</div>
                    </div>
                    <div class="coin-stats">
                        <div class="stat">
                            <div class="stat-label">Price</div>
                            <div class="stat-value">${coin.price}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">24h Change</div>
                            <div class="stat-value ${parseFloat(coin.gain) >= 0 ? 'gain-positive' : 'gain-negative'}">${coin.gain}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Volume</div>
                            <div class="stat-value">${coin.volume}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Liquidity</div>
                            <div class="stat-value">${coin.liquidity}</div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <div class="contract-address">
                            <span>${formatAddress(coin.contract)}</span>
                            <button class="copy-btn" onclick="copyContract('${coin.contract}', this)">Copy</button>
                        </div>
                        <button class="share-card-btn" onclick="openShareModal('trending', ${index})">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            `).join('');
        }
        return;
    }
    
    container.className = 'coin-grid';
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p style="margin-top: 20px; color: #9ca3af;">Loading trending coins...</p>
        </div>
    `;

    trendingCoinsData = [];
    
    for (const address of mockTrendingCoins) {
        const data = await fetchCoinData(address);
        if (data) {
            trendingCoinsData.push(data);
        }
    }

    updateLastUpdated('trending');

    if (trendingCoinsData.length === 0) {
        container.innerHTML = `
            <div class="error-message">
                <p>No trending coins data available right now.</p>
            </div>
        `;
        return;
    }

    // Apply current sort
    if (currentSort.trending !== 'default') {
        sortCoins('trending', currentSort.trending);
    } else {
        renderCoins('trending');
    }
}

// Render user coins
async function renderUserCoins() {
    const container = document.getElementById('userCoinsContainer');
    if (!container) return;
    
    if (userCoinAddresses.length === 0) {
        container.className = 'coin-grid';
        container.innerHTML = `
            <div class="error-message" style="color: #9ca3af;">
                <p>No coins added yet. Add coin addresses above to start tracking!</p>
            </div>
        `;
        updateLastUpdated('user');
        return;
    }

    // If we already have data and just switching views, don't reload
    if (userCoinsData.length > 0 && userCoinsData.length === userCoinAddresses.length) {
        if (currentViews.user === 'table') {
            container.innerHTML = generateTableHTML(userCoinsData, 'user');
        } else {
            container.className = 'coin-grid';
            container.innerHTML = userCoinsData.map((coin, index) => `
                <div class="coin-card">
                    <button class="remove-coin-btn" onclick="removeCoin(${index})" title="Remove coin">×</button>
                    <div class="coin-header">
                        <div>
                            <div class="coin-name">${coin.name}</div>
                            <div class="chain-name">${coin.chain}</div>
                        </div>
                        <div class="coin-symbol">${coin.symbol}</div>
                    </div>
                    <div class="coin-stats">
                        <div class="stat">
                            <div class="stat-label">Price</div>
                            <div class="stat-value">${coin.price}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">24h Change</div>
                            <div class="stat-value ${parseFloat(coin.gain) >= 0 ? 'gain-positive' : 'gain-negative'}">${coin.gain}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Volume</div>
                            <div class="stat-value">${coin.volume}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Liquidity</div>
                            <div class="stat-value">${coin.liquidity}</div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <div class="contract-address">
                            <span>${formatAddress(coin.contract)}</span>
                            <button class="copy-btn" onclick="copyContract('${coin.contract}', this)">Copy</button>
                        </div>
                        <button class="share-card-btn" onclick="openShareModal('user', ${index})">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            `).join('');
        }
        return;
    }

    container.className = 'coin-grid';
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p style="margin-top: 20px; color: #9ca3af;">Loading coin data...</p>
        </div>
    `;

    userCoinsData = [];
    
    for (const address of userCoinAddresses) {
        const data = await fetchCoinData(address);
        if (data) {
            userCoinsData.push(data);
        }
    }

    updateLastUpdated('user');

    if (userCoinsData.length === 0) {
        container.innerHTML = `
            <div class="error-message">
                <p>No valid coin data found. Please check the addresses.</p>
            </div>
        `;
        return;
    }

    // Apply current sort
    if (currentSort.user !== 'default') {
        sortCoins('user', currentSort.user);
    } else {
        renderCoins('user');
    }
}

// Add coin function
function addCoin() {
    const input = document.getElementById('coinAddressInput');
    if (!input) return;
    
    const address = input.value.trim();
    
    if (address && !userCoinAddresses.includes(address)) {
        userCoinAddresses.push(address);
        input.value = '';
        renderUserCoins();
        saveUserCoins();
    }
}

// Remove coin function
function removeCoin(index) {
    userCoinAddresses.splice(index, 1);
    userCoinsData.splice(index, 1);
    renderUserCoins();
    saveUserCoins();
}

// Share functionality
function openShareModal(type, coinIndex) {
    if (type === 'trending') {
        currentCoinData = trendingCoinsData[coinIndex];
    } else {
        currentCoinData = userCoinsData[coinIndex];
    }
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.style.display = 'flex';
        generateShareCard();
    }
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateShareCard() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas || !currentCoinData) return;
    
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 418);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#334155');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 418);

    // Add grid pattern
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 800; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 418);
        ctx.stroke();
    }
    for (let i = 0; i < 418; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(800, i);
        ctx.stroke();
    }

    // Add glow effect
    const glowGradient = ctx.createRadialGradient(400, 209, 0, 400, 209, 300);
    glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, 800, 418);

    // TRAVA Logo
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const logoGradient = ctx.createLinearGradient(50, 30, 150, 70);
    logoGradient.addColorStop(0, '#3b82f6');
    logoGradient.addColorStop(0.5, '#8b5cf6');
    logoGradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = logoGradient;
    ctx.fillText('TRAVA', 50, 60);

    // Tagline
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('DAILY MEMECOIN RUNNERS', 50, 85);

    // Main content box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(50, 120, 700, 200, 20);
    } else {
        ctx.rect(50, 120, 700, 200);
    }
    ctx.fill();
    ctx.stroke();

    // Coin name
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(currentCoinData.name, 80, 190);

    // Symbol in top right of the card
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#06b6d4';
    const symbolWidth = ctx.measureText(currentCoinData.symbol).width;
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(700 - symbolWidth - 50, 140, symbolWidth + 30, 40, 20);
    } else {
        ctx.rect(700 - symbolWidth - 50, 140, symbolWidth + 30, 40);
    }
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(currentCoinData.symbol, 700 - symbolWidth - 35, 167);

    // Stats
    const stats = [
        { label: 'PRICE', value: currentCoinData.price },
        { label: '24H CHANGE', value: currentCoinData.gain, highlight: parseFloat(currentCoinData.gain) >= 0 },
        { label: 'VOLUME', value: currentCoinData.volume },
        { label: 'LIQUIDITY', value: currentCoinData.liquidity }
    ];

    stats.forEach((stat, i) => {
        const x = 80 + (i * 160);
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(stat.label, x, 250);
        
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = stat.highlight ? '#10b981' : (stat.highlight === false ? '#f87171' : '#06b6d4');
        ctx.fillText(stat.value, x, 280);
    });

    // Footer
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Track more gems at TRAVA', 50, 370);
    
    // Website URL
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('trava.fun', 250, 370);

    // Chain name
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Chain: ${currentCoinData.chain}`, 600, 370);

    // Rocket emoji
    ctx.font = '64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🚀', 650, 380);

    // Update Twitter share link
    const tweetText = `Just found ${currentCoinData.name} (${currentCoinData.symbol}) on TRAVA! 🚀\n\n📈 ${currentCoinData.gain} in 24h\n💰 Volume: ${currentCoinData.volume}\n💧 Liquidity: ${currentCoinData.liquidity}\n\nTrack more daily runners at`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://trava.io')}`;
    const twitterBtn = document.getElementById('twitterShareBtn');
    if (twitterBtn) {
        twitterBtn.href = twitterUrl;
    }
}

function downloadShareCard() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas || !currentCoinData) return;
    
    const link = document.createElement('a');
    link.download = `TRAVA-${currentCoinData.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function copyContract(contract, button) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(contract);
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    }
}

// Add roundRect polyfill for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Load user coins from localStorage
function loadUserCoins() {
    try {
        const saved = localStorage.getItem('travaUserCoins');
        if (saved) {
            userCoinAddresses = JSON.parse(saved);
            if (userCoinAddresses.length > 0) {
                renderUserCoins();
            }
        }
    } catch (error) {
        console.error('Error loading user coins:', error);
    }
}

// Save user coins to localStorage
function saveUserCoins() {
    try {
        localStorage.setItem('travaUserCoins', JSON.stringify(userCoinAddresses));
    } catch (error) {
        console.error('Error saving user coins:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Fallback for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
