// GitHub API Configuration
const GITHUB_USERNAME = 'John-Varghese-EH';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const bentoContainer = document.getElementById('bentoContainer');

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
        'Dart': '#00B4AB'
    };
    return colors[language] || '#00ff41';
}

// Cache Management
function getCachedData() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
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

function setCachedData(data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

// Repository Card Creation
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Add random grid span for Bento effect
    const randomSpan = Math.random();
    if (randomSpan > 0.7) {
        card.style.gridRow = 'span 2';
    } else if (randomSpan > 0.85) {
        card.style.gridColumn = 'span 2';
    }

    const languageColor = repo.language ? getLanguageColor(repo.language) : '#00ff41';
    
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
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
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

// API Functions
async function fetchRepositories() {
    try {
        // Check cache first
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('Using cached data');
            return cachedData;
        }

        console.log('Fetching from GitHub API');
        const response = await fetch(GITHUB_API_URL);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();
        
        // Filter and sort repositories
        const filteredRepos = repos
            .filter(repo => !repo.fork) // Exclude forked repositories
            .sort((a, b) => {
                // Sort by stars first, then by update date
                if (b.stargazers_count !== a.stargazers_count) {
                    return b.stargazers_count - a.stargazers_count;
                }
                return new Date(b.updated_at) - new Date(a.updated_at);
            })
            .slice(0, 12); // Limit to 12 repositories

        // Cache the data
        setCachedData(filteredRepos);
        
        return filteredRepos;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

// Main Functions
function showLoading() {
    loadingSpinner.style.display = 'flex';
    errorMessage.style.display = 'none';
    bentoContainer.style.display = 'none';
}

function showError(message) {
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.querySelector('p').textContent = message;
    bentoContainer.style.display = 'none';
}

function showRepositories(repos) {
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'none';
    bentoContainer.style.display = 'grid';
    
    // Clear existing content
    bentoContainer.innerHTML = '';
    
    // Create and append repository cards
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

// Smooth Scrolling
function initSmoothScrolling() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Intersection Observer for Animations
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
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.about-section, .repos-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Initialize Application
async function init() {
    console.log('Initializing GitHub Portfolio...');
    
    // Initialize smooth scrolling and animations
    initSmoothScrolling();
    initScrollAnimations();
    
    // Show loading state
    showLoading();
    
    try {
        // Fetch repositories
        const repos = await fetchRepositories();
        
        if (repos.length === 0) {
            showError('No repositories found.');
            return;
        }
        
        // Display repositories
        showRepositories(repos);
        
        console.log(`Successfully loaded ${repos.length} repositories`);
        
    } catch (error) {
        console.error('Failed to load repositories:', error);
        showError(error.message || 'Failed to load repositories. Please try again later.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', init);

// Handle visibility change to refresh data when tab becomes active
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Check if cache is expired and refresh if needed
        const cachedData = getCachedData();
        if (!cachedData) {
            console.log('Cache expired, refreshing data...');
            init();
        }
    }
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('Connection restored, refreshing data...');
    init();
});

window.addEventListener('offline', () => {
    console.log('Connection lost, using cached data if available');
});