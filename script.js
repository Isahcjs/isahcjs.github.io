
class DocsGenerator {
    constructor() {
        this.data = null;
        this.currentSection = 'home';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupTheme();
        this.generateSidebar();
        this.generateContent();
        this.setupAnimations();
        this.hideLoading();
        this.updateProgress();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = { navigation: [], content: {} };
        }
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const section = e.target.getAttribute('href').slice(1);
                this.navigateToSection(section);
            }
        });

        // Sidebar items
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-item')) {
                const section = e.target.dataset.section;
                const subsection = e.target.dataset.subsection;
                this.navigateToSection(section, subsection);
            }
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        
        mobileMenuBtn?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Scroll to top
        const scrollToTop = document.getElementById('scroll-to-top');
        scrollToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Copy code functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.copyCode(e.target);
            }
        });
    }

    setupTheme() {
        const html = document.documentElement;
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        if (this.darkMode) {
            html.classList.add('dark');
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        } else {
            html.classList.remove('dark');
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode.toString());
        this.setupTheme();
    }

    generateSidebar() {
        const sidebarContent = document.getElementById('sidebar-content');
        if (!sidebarContent || !this.data.navigation) return;

        let html = '';
        
        this.data.navigation.forEach(nav => {
            html += `
                <div class="mb-4">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                        ${nav.title}
                    </h3>
                    <div class="space-y-1">
            `;
            
            nav.sections?.forEach(section => {
                html += `
                    <div class="sidebar-item text-sm text-gray-600 dark:text-gray-400"
                         data-section="${nav.id}" 
                         data-subsection="${section.id}">
                        ${section.title}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        sidebarContent.innerHTML = html;
    }

    generateContent() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        const content = this.data.content[this.currentSection];
        if (!content) return;

        let html = '';

        switch (this.currentSection) {
            case 'home':
                html = this.generateHomeContent(content);
                break;
            case 'getting-started':
                html = this.generateGettingStartedContent(content);
                break;
            case 'api':
                html = this.generateApiContent(content);
                break;
            case 'examples':
                html = this.generateExamplesContent(content);
                break;
            default:
                html = '<div class="text-center py-8">Section not found</div>';
        }

        mainContent.innerHTML = html;
        this.setupAnimations();
    }

    generateHomeContent(content) {
        return `
            <div class="space-y-16">
                <!-- Hero Section -->
                <section class="hero-section text-center py-16 fade-in-up">
                    <h1 class="text-6xl font-bold gradient-text mb-6 stagger-1">
                        ${content.hero.title}
                    </h1>
                    <p class="text-2xl text-gray-600 dark:text-gray-300 mb-4 fade-in-up stagger-2">
                        ${content.hero.subtitle}
                    </p>
                    <p class="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto fade-in-up stagger-3">
                        ${content.hero.description}
                    </p>
                    <div class="flex justify-center space-x-4 fade-in-up stagger-4">
                        ${content.hero.buttons.map(btn => `
                            <a href="${btn.link}" class="nav-link px-8 py-3 rounded-lg font-semibold transition-all duration-300 animate-pulse-hover ${
                                btn.style === 'primary' 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                            }">
                                ${btn.text}
                            </a>
                        `).join('')}
                    </div>
                </section>

                <!-- Introduction -->
                <section class="slide-in-left">
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        ${content.introduction.title}
                    </h2>
                    <p class="text-lg text-gray-600 dark:text-gray-300">
                        ${content.introduction.content}
                    </p>
                </section>

                <!-- Features -->
                <section class="slide-in-right">
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        ${content.features.title}
                    </h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${content.features.items.map((item, index) => `
                            <div class="card-hover bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md fade-in-up stagger-${index + 1}">
                                <div class="text-3xl mb-4">${item.icon}</div>
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    ${item.title}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-300">
                                    ${item.description}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Installation -->
                <section class="slide-in-left">
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        ${content.installation.title}
                    </h2>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        ${content.installation.content}
                    </p>
                    <div class="space-y-4">
                        <div class="code-block">
                            <button class="copy-btn">Copy</button>
                            <pre><code class="language-bash">${content.installation.code.npm}</code></pre>
                        </div>
                        <div class="code-block">
                            <button class="copy-btn">Copy</button>
                            <pre><code class="language-bash">${content.installation.code.yarn}</code></pre>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    generateGettingStartedContent(content) {
        return `
            <div class="space-y-12">
                ${Object.entries(content).map(([key, section]) => `
                    <section class="fade-in-up">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            ${section.title}
                        </h2>
                        ${section.content ? `
                            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                ${section.content}
                            </p>
                        ` : ''}
                        ${section.code ? `
                            <div class="code-block mb-6">
                                <button class="copy-btn">Copy</button>
                                <pre><code class="language-javascript">${section.code}</code></pre>
                            </div>
                        ` : ''}
                        ${section.sections ? section.sections.map(subsection => `
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    ${subsection.title}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">
                                    ${subsection.content}
                                </p>
                                ${subsection.code ? `
                                    <div class="code-block">
                                        <button class="copy-btn">Copy</button>
                                        <pre><code class="language-javascript">${subsection.code}</code></pre>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('') : ''}
                    </section>
                `).join('')}
            </div>
        `;
    }

    generateApiContent(content) {
        return `
            <div class="space-y-12">
                ${Object.entries(content).map(([key, section]) => `
                    <section class="fade-in-up">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            ${section.title}
                        </h2>
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            ${section.description}
                        </p>
                        
                        ${section.methods ? `
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Methods</h3>
                                ${section.methods.map(method => `
                                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            <code class="text-blue-600 dark:text-blue-400">${method.name}</code>
                                        </h4>
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">${method.description}</p>
                                        
                                        ${method.parameters ? `
                                            <div class="mb-4">
                                                <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Parameters:</h5>
                                                <ul class="space-y-2">
                                                    ${method.parameters.map(param => `
                                                        <li class="text-sm">
                                                            <code class="text-blue-600 dark:text-blue-400">${param.name}</code>
                                                            <span class="text-gray-500">(${param.type}${param.optional ? ', optional' : ''})</span>
                                                            - ${param.description}
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                        
                                        ${method.returns ? `
                                            <div class="mb-4">
                                                <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Returns:</h5>
                                                <code class="text-green-600 dark:text-green-400">${method.returns}</code>
                                            </div>
                                        ` : ''}
                                        
                                        ${method.example ? `
                                            <div class="code-block">
                                                <button class="copy-btn">Copy</button>
                                                <pre><code class="language-javascript">${method.example}</code></pre>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${section.functions ? `
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Functions</h3>
                                ${section.functions.map(func => `
                                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            <code class="text-blue-600 dark:text-blue-400">${func.name}</code>
                                        </h4>
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">${func.description}</p>
                                        ${func.example ? `
                                            <div class="code-block">
                                                <button class="copy-btn">Copy</button>
                                                <pre><code class="language-javascript">${func.example}</code></pre>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${section.classes ? `
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Classes</h3>
                                ${section.classes.map(cls => `
                                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            <code class="text-blue-600 dark:text-blue-400">${cls.name}</code>
                                        </h4>
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">${cls.description}</p>
                                        ${cls.methods ? `
                                            <div>
                                                <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Methods:</h5>
                                                <ul class="space-y-1">
                                                    ${cls.methods.map(method => `
                                                        <li class="text-sm">
                                                            <code class="text-blue-600 dark:text-blue-400">${method.name}</code>
                                                            - ${method.description}
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </section>
                `).join('')}
            </div>
        `;
    }

    generateExamplesContent(content) {
        return `
            <div class="space-y-12">
                ${Object.entries(content).map(([key, section]) => `
                    <section class="fade-in-up">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            ${section.title}
                        </h2>
                        <div class="space-y-8">
                            ${section.examples.map(example => `
                                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md card-hover">
                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        ${example.title}
                                    </h3>
                                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                                        ${example.description}
                                    </p>
                                    <div class="code-block">
                                        <button class="copy-btn">Copy</button>
                                        <pre><code class="language-javascript">${example.code}</code></pre>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        `;
    }

    navigateToSection(section, subsection = null) {
        this.currentSection = section;
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section}`) {
                link.classList.add('active');
            }
        });

        // Update active sidebar item
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section && 
                (!subsection || item.dataset.subsection === subsection)) {
                item.classList.add('active');
            }
        });

        // Generate new content
        this.generateContent();
        
        // Scroll to top or subsection
        if (subsection) {
            setTimeout(() => {
                const element = document.getElementById(subsection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('fade-in-up')) {
                        element.classList.add('animate-fade-in-up');
                    }
                    if (element.classList.contains('slide-in-left')) {
                        element.classList.add('animate-slide-in-left');
                    }
                    if (element.classList.contains('slide-in-right')) {
                        element.classList.add('animate-slide-in-right');
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all animation elements
        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });

        // Re-highlight code blocks
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const navbar = document.getElementById('navbar');

        // Show/hide scroll to top button
        if (scrollTop > 300) {
            scrollToTopBtn.classList.remove('translate-y-16', 'opacity-0');
            scrollToTopBtn.classList.add('translate-y-0', 'opacity-100');
        } else {
            scrollToTopBtn.classList.add('translate-y-16', 'opacity-0');
            scrollToTopBtn.classList.remove('translate-y-0', 'opacity-100');
        }

        // Navbar background opacity
        const opacity = Math.min(scrollTop / 100, 1);
        if (navbar) {
            navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.9})`;
            if (document.documentElement.classList.contains('dark')) {
                navbar.style.backgroundColor = `rgba(17, 24, 39, ${opacity * 0.9})`;
            }
        }

        this.updateProgress();
    }

    updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrolled + '%';
    }

    copyCode(button) {
        const codeBlock = button.nextElementSibling.querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('bg-green-600');
            }, 2000);
        }).catch(() => {
            button.textContent = 'Error';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    }

    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 1500);
    }
}

// Initialize the documentation generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocsGenerator();
});
