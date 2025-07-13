// Configuration
const GITHUB_USERNAME = 'John-Varghese-EH';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const REPOS_API_URL = `${GITHUB_API_URL}/repos`;
const EVENTS_API_URL = `${GITHUB_API_URL}/events`;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Cache keys
const CACHE_KEYS = {
    repos: 'github_repos_cache',
    commits: 'github_commits_cache',
    contributions: 'github_contributions_cache'
};

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const bentoContainer = document.getElementById('bentoContainer');
const commitsContainer = document.getElementById('commitsContainer');
const contributionGraph = document.getElementById('contributionGraph');

// Typing animation texts
const typingTexts = [
    'CYBERSECURITY SPECIALIST',
    'ETHICAL HACKER',
    'PENETRATION TESTER',
    'DIGITAL INNOVATOR',
    'SECURITY RESEARCHER'
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Initialize all components
        await Promise.all([
            initTypingAnimation(),
            initCursorTrail(),
            initMatrixBackground(),
            initFloatingElements(),
            initScrollAnimations(),
            loadGitHubData()
        ]);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Custom Cursor Trail
function initCursorTrail() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    const cursorTrail = document.querySelector('.cursor-trail');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    if (!cursorTrail || !cursorGlow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth trail following
        trailX += (mouseX - trailX) * 0.3;
        trailY += (mouseY - trailY) * 0.3;
        
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .repo-card, .social-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorTrail.style.transform = 'scale(1.5)';
            cursorGlow.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorTrail.style.transform = 'scale(1)';
            cursorGlow.style.transform = 'scale(1)';
        });
    });
}

// Matrix Background
function initMatrixBackground() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
}

// Floating Elements Animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-speed]');
    
    if (window.innerWidth <= 1200) return; // Disable on smaller screens
    
    function animateFloatingElements() {
        floatingElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = window.mouseX || window.innerWidth / 2;
            const mouseY = window.mouseY || window.innerHeight / 2;
            
            const deltaX = (mouseX - centerX) * speed * 0.01;
            const deltaY = (mouseY - centerY) * speed * 0.01;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        requestAnimationFrame(animateFloatingElements);
    }
    
    document.addEventListener('mousemove', (e) => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });
    
    animateFloatingElements();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.skill-category, .repo-card, .commit-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Observe individual elements
    document.querySelectorAll('.skill-category, .repo-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Cache Management
function getCachedData(key) {
    try {
        const cached = localStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
    } catch (error) {
        console.error('Error reading cache:', error);
    }
    return null;
}

function setCachedData(key, data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

// GitHub Data Loading
async function loadGitHubData() {
    try {
        await Promise.all([
            loadRepositories(),
            loadRecentCommits(),
            loadContributions()
        ]);
    } catch (error) {
        console.error('Error loading GitHub data:', error);
    }
}

// Repository Functions
async function loadRepositories() {
    try {
        showLoading();
        
        // Check cache first
        const cachedRepos = getCachedData(CACHE_KEYS.repos);
        if (cachedRepos) {
            showRepositories(cachedRepos);
            return;
        }
        
        const response = await fetch(REPOS_API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => {
                if (b.stargazers_count !== a.stargazers_count) {
                    return b.stargazers_count - a.stargazers_count;
                }
                return new Date(b.updated_at) - new Date(a.updated_at);
            })
            .slice(0, 12);
        
        setCachedData(CACHE_KEYS.repos, filteredRepos);
        showRepositories(filteredRepos);
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        showError('Unable to load repositories. Please try again later.');
    }
}

function showLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (errorMessage) errorMessage.style.display = 'none';
    if (bentoContainer) bentoContainer.style.display = 'none';
}

function showError(message) {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
    }
    if (bentoContainer) bentoContainer.style.display = 'none';
}

function showRepositories(repos) {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (bentoContainer) bentoContainer.style.display = 'grid';
    
    bentoContainer.innerHTML = '';
    
    repos.forEach((repo, index) => {
        const card = createRepoCard(repo);
        
        // Add staggered animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        bentoContainer.appendChild(card);
    });
}

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Random grid span for Bento effect
    const randomSpan = Math.random();
    if (randomSpan > 0.7) {
        card.style.gridRow = 'span 2';
    } else if (randomSpan > 0.85) {
        card.style.gridColumn = 'span 2';
    }
    
    const languageColor = getLanguageColor(repo.language);
    
    card.innerHTML = `
        <div class="repo-header">
            <img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" class="repo-avatar">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-title">
                ${repo.name}
            </a>
        </div>
        <p class="repo-description">
            ${repo.description || 'No description available'}
        </p>
        <div class="repo-stats">
            <div class="repo-stat">
                <i class="fas fa-star"></i>
                <span>${formatNumber(repo.stargazers_count)}</span>
            </div>
            <div class="repo-stat">
                <i class="fas fa-code-branch"></i>
                <span>${formatNumber(repo.forks_count)}</span>
            </div>
            <div class="repo-stat">
                <i class="fas fa-eye"></i>
                <span>${formatNumber(repo.watchers_count)}</span>
            </div>
            <div class="repo-stat">
                <i class="fas fa-calendar-alt"></i>
                <span>${formatDate(repo.updated_at)}</span>
            </div>
        </div>
        ${repo.language ? `<span class="repo-language" style="background-color: ${languageColor}20; color: ${languageColor}; border: 1px solid ${languageColor}40;">${repo.language}</span>` : ''}
    `;
    
    // Add 3D hover effect
    card.addEventListener('mouseenter', () => {
        card.addEventListener('mousemove', handleMouseMove);
    });
    
    card.addEventListener('mouseleave', () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.style.transform = '';
    });
    
    function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (centerX - e.clientX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
    
    return card;
}

// Recent Commits
async function loadRecentCommits() {
    try {
        const cachedCommits = getCachedData(CACHE_KEYS.commits);
        if (cachedCommits) {
            showCommits(cachedCommits);
            return;
        }
        
        const response = await fetch(EVENTS_API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const events = await response.json();
        const pushEvents = events
            .filter(event => event.type === 'PushEvent')
            .slice(0, 10)
            .map(event => ({
                id: event.id,
                repo: event.repo.name,
                message: event.payload.commits[0]?.message || 'No commit message',
                date: event.created_at,
                avatar: event.actor.avatar_url,
                author: event.actor.login
            }));
        
        setCachedData(CACHE_KEYS.commits, pushEvents);
        showCommits(pushEvents);
        
    } catch (error) {
        console.error('Error loading commits:', error);
        showCommitsError();
    }
}

function showCommits(commits) {
    if (!commitsContainer) return;
    
    commitsContainer.innerHTML = '';
    
    if (commits.length === 0) {
        commitsContainer.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No recent commits found.</p>';
        return;
    }
    
    commits.forEach((commit, index) => {
        const commitElement = document.createElement('div');
        commitElement.className = 'commit-item';
        commitElement.style.opacity = '0';
        commitElement.style.transform = 'translateX(-20px)';
        
        commitElement.innerHTML = `
            <img src="${commit.avatar}" alt="${commit.author}" class="commit-avatar">
            <div class="commit-info">
                <div class="commit-message">${commit.message}</div>
                <div class="commit-details">
                    <span class="commit-repo">${commit.repo}</span>
                    <span>${formatDate(commit.date)}</span>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            commitElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            commitElement.style.opacity = '1';
            commitElement.style.transform = 'translateX(0)';
        }, index * 100);
        
        commitsContainer.appendChild(commitElement);
    });
}

function showCommitsError() {
    if (!commitsContainer) return;
    
    commitsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #ff6b6b;"></i>
            <p>Unable to load recent commits.</p>
        </div>
    `;
}

// Contributions
async function loadContributions() {
    try {
        const cachedContributions = getCachedData(CACHE_KEYS.contributions);
        if (cachedContributions) {
            showContributions(cachedContributions);
            return;
        }
        
        // Generate mock contribution data (GitHub API doesn't provide contribution graph data)
        const contributions = generateMockContributions();
        
        setCachedData(CACHE_KEYS.contributions, contributions);
        showContributions(contributions);
        
    } catch (error) {
        console.error('Error loading contributions:', error);
        showContributionsError();
    }
}

function generateMockContributions() {
    const contributions = [];
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const level = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
        contributions.push({
            date: new Date(d).toISOString().split('T')[0],
            count: level * Math.floor(Math.random() * 5) + level,
            level: level
        });
    }
    
    return contributions;
}

function showContributions(contributions) {
    if (!contributionGraph) return;
    
    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
    const currentStreak = calculateStreak(contributions);
    
    contributionGraph.innerHTML = `
        <div class="contribution-stats">
            <div class="stat-item">
                <span class="stat-value">${totalContributions}</span>
                <span class="stat-label">Total Contributions</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${currentStreak}</span>
                <span class="stat-label">Current Streak</span>
            </div>
        </div>
        <div class="contribution-grid" id="contributionGrid"></div>
        <div class="contribution-legend">
            <span>Less</span>
            <div class="legend-colors">
                <div class="legend-color level-0"></div>
                <div class="legend-color level-1"></div>
                <div class="legend-color level-2"></div>
                <div class="legend-color level-3"></div>
                <div class="legend-color level-4"></div>
            </div>
            <span>More</span>
        </div>
    `;
    
    const grid = document.getElementById('contributionGrid');
    contributions.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = `contribution-day level-${day.level}`;
        dayElement.title = `${day.count} contributions on ${day.date}`;
        
        setTimeout(() => {
            dayElement.style.opacity = '1';
            dayElement.style.transform = 'scale(1)';
        }, index * 2);
        
        grid.appendChild(dayElement);
    });
}

function calculateStreak(contributions) {
    let streak = 0;
    for (let i = contributions.length - 1; i >= 0; i--) {
        if (contributions[i].count > 0) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function showContributionsError() {
    if (!contributionGraph) return;
    
    contributionGraph.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-gray);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #ff6b6b;"></i>
            <p>Unable to load contribution data.</p>
        </div>
    `;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'PHP': '#4F5D95',
        'Shell': '#89e051',
        'Kotlin': '#F18E33',
        'Swift': '#ffac45',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Ruby': '#701516',
        'Dart': '#00B4AB',
        'Vue': '#4FC08D',
        'React': '#61DAFB'
    };
    return colors[language] || '#00ff41';
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh data when tab becomes active
        const lastUpdate = localStorage.getItem('last_update');
        const now = Date.now();
        
        if (!lastUpdate || now - parseInt(lastUpdate) > CACHE_DURATION) {
            loadGitHubData();
            localStorage.setItem('last_update', now.toString());
        }
    }
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('Connection restored, refreshing data...');
    loadGitHubData();
});

window.addEventListener('offline', () => {
    console.log('Connection lost, using cached data');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for contribution stats and legend
const additionalCSS = `
.contribution-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 2rem;
}

.contribution-stats .stat-item {
    text-align: center;
}

.contribution-stats .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-green);
    font-family: var(--font-primary);
}

.contribution-stats .stat-label {
    font-size: 0.9rem;
    color: var(--text-gray);
}

.contribution-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: 0.8rem;
    color: var(--text-gray);
}

.legend-colors {
    display: flex;
    gap: 2px;
}

.legend-color {
    width: 10px;
    height: 10px;
    border-radius: 2px;
}

.legend-color.level-0 { background: rgba(0, 255, 65, 0.1); }
.legend-color.level-1 { background: rgba(0, 255, 65, 0.3); }
.legend-color.level-2 { background: rgba(0, 255, 65, 0.5); }
.legend-color.level-3 { background: rgba(0, 255, 65, 0.7); }
.legend-color.level-4 { background: var(--primary-green); }

@media (max-width: 768px) {
    .contribution-stats {
        gap: 2rem;
    }
    
    .contribution-stats .stat-value {
        font-size: 1.5rem;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);