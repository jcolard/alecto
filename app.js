let publications = [];
let activeTags = new Set();
let searchQuery = '';

// PWA Logic
let deferredPrompt;
const pwaModal = document.getElementById('pwa-modal');
const pwaModalContent = document.getElementById('pwa-modal-content');
const btnInstallPwa = document.getElementById('btn-install-pwa');
const btnClosePwa = document.getElementById('btn-close-pwa');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.error('SW failed', err));
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!localStorage.getItem('pwa-prompt-dismissed')) {
        setTimeout(() => {
            if (deferredPrompt) openPwaModal();
        }, 30000);
    }
});

function openPwaModal() {
    pwaModal.classList.remove('hidden');
    void pwaModal.offsetWidth;
    pwaModal.classList.remove('opacity-0');
    pwaModalContent.classList.remove('translate-y-full', 'md:translate-y-8');
    pwaModalContent.classList.add('translate-y-0');
}

function closePwaModal() {
    pwaModal.classList.add('opacity-0');
    pwaModalContent.classList.remove('translate-y-0');
    pwaModalContent.classList.add('translate-y-full', 'md:translate-y-8');
    setTimeout(() => {
        pwaModal.classList.add('hidden');
    }, 300);
}

if (btnClosePwa) {
    btnClosePwa.onclick = () => {
        localStorage.setItem('pwa-prompt-dismissed', 'true');
        closePwaModal();
    };
}
if (btnInstallPwa) {
    btnInstallPwa.onclick = () => triggerPwaInstall();
}

window.triggerPwaInstall = function() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                deferredPrompt = null;
                closePwaModal();
            }
        });
    } else {
        alert("L'application est peut-être déjà installée ou votre navigateur actuel ne supporte pas l'installation PWA native.");
    }
};

const cookieModal = document.getElementById('cookie-modal');
const cookieContent = document.getElementById('cookie-modal-content');
const btnAcceptCookies = document.getElementById('btn-accept-cookies');
const btnRefuseCookies = document.getElementById('btn-refuse-cookies');
const btnCloseCookies = document.getElementById('btn-close-cookies');

function openCookieModal() {
    if (!cookieModal) return;
    cookieModal.classList.remove('opacity-0', 'pointer-events-none');
    cookieContent.classList.remove('scale-95');
}

function closeCookieModal(decision) {
    if (!cookieModal) return;
    if (decision) localStorage.setItem('alekto_cookies', decision);
    cookieModal.classList.add('opacity-0', 'pointer-events-none');
    cookieContent.classList.add('scale-95');
}

if (btnAcceptCookies) btnAcceptCookies.addEventListener('click', () => closeCookieModal('accepted'));
if (btnRefuseCookies) btnRefuseCookies.addEventListener('click', () => closeCookieModal('refused'));
if (btnCloseCookies) btnCloseCookies.addEventListener('click', () => closeCookieModal(null));

// Elements
const viewGeneral = document.getElementById('view-general');
const viewDetail = document.getElementById('view-detail');
const carouselsContainer = document.getElementById('carousels-container');
const tagsDropdown = document.getElementById('tags-dropdown');
const searchBtn = document.getElementById('search-btn');
const btnBack = document.getElementById('btn-back');
const detailContent = document.getElementById('detail-content');
const detailTitle = document.getElementById('detail-title');
const globalAudioPlayer = document.getElementById('global-audio-player');
const logoTitleContainer = document.getElementById('logo-title-container');

const floatingPlayer = document.getElementById('floating-player');
const floatingThumb = document.getElementById('floating-player-thumb');
const floatingTitle = document.getElementById('floating-player-title');
const floatingPlayBtn = document.getElementById('floating-play-btn');
const floatingPlayIcon = document.getElementById('floating-play-icon');
const floatingCloseBtn = document.getElementById('floating-close-btn');
const floatingProgressContainer = document.getElementById('floating-progress-container');
const floatingProgressBar = document.getElementById('floating-progress-bar');
let currentFloatingPublication = null;

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function syncFloatingPlayerUI(p) {
    floatingTitle.textContent = p.titre;
    floatingThumb.src = p.image_url || 'https://via.placeholder.com/250x180?text=Audio';
    floatingPlayer.classList.remove('translate-y-48', 'opacity-0');
}

function playFloatingAudio(id) {
    const p = publications.find(pub => pub.id === id);
    if (!p || !p.fichier) return;
    
    if (globalAudioPlayer.src && globalAudioPlayer.src.endsWith(p.fichier)) {
        if (globalAudioPlayer.paused) {
            currentFloatingPublication = p;
            syncFloatingPlayerUI(p);
            globalAudioPlayer.play();
        } else {
            globalAudioPlayer.pause();
        }
    } else {
        currentFloatingPublication = p;
        syncFloatingPlayerUI(p);
        globalAudioPlayer.src = p.fichier;
        globalAudioPlayer.play();
    }
}

function syncAllCardIcons(isPlaying) {
    const allCardIcons = document.querySelectorAll('.card-play-icon');
    allCardIcons.forEach(icon => {
        icon.innerText = 'play_arrow'; // Reset all
    });
    
    if (isPlaying && currentFloatingPublication) {
        const activeCardIcons = document.querySelectorAll(`.card-play-icon[data-audio-id="${currentFloatingPublication.id}"]`);
        activeCardIcons.forEach(icon => {
            icon.innerText = 'pause';
        });
    }
}

// Bind Global Audio Events
globalAudioPlayer.addEventListener('timeupdate', () => {
    const percent = (globalAudioPlayer.currentTime / globalAudioPlayer.duration) * 100 || 0;
    if (currentFloatingPublication) {
        floatingProgressBar.style.width = `${percent}%`;
    }
    const currentEl = document.getElementById('audio-current');
    if (currentEl) {
        currentEl.textContent = formatTime(globalAudioPlayer.currentTime);
        document.getElementById('progress-bar').style.width = `${percent}%`;
    }
});

globalAudioPlayer.addEventListener('loadedmetadata', () => {
    const totalEl = document.getElementById('audio-total');
    if (totalEl) totalEl.textContent = formatTime(globalAudioPlayer.duration);
});

globalAudioPlayer.addEventListener('play', () => {
    floatingPlayIcon.innerText = 'pause';
    syncAllCardIcons(true);
    const playIcon = document.getElementById('play-icon');
    if (playIcon) {
        playIcon.innerText = 'pause';
        const vinyl = document.getElementById('vinyl-disc');
        if (vinyl) {
            vinyl.style.transform = 'translateX(25%)';
            setTimeout(() => { if (!globalAudioPlayer.paused) vinyl.classList.add('spinning'); }, 500);
        }
    }
});

globalAudioPlayer.addEventListener('pause', () => {
    floatingPlayIcon.innerText = 'play_arrow';
    syncAllCardIcons(false);
    const playIcon = document.getElementById('play-icon');
    if (playIcon) {
        playIcon.innerText = 'play_arrow';
        const vinyl = document.getElementById('vinyl-disc');
        if (vinyl) {
            vinyl.classList.remove('spinning');
            vinyl.style.transform = 'translateX(50%) rotate(0deg)';
        }
    }
});

globalAudioPlayer.addEventListener('ended', () => {
    floatingPlayIcon.innerText = 'play_arrow';
    syncAllCardIcons(false);
    const playIcon = document.getElementById('play-icon');
    if (playIcon) {
        playIcon.innerText = 'play_arrow';
        const vinyl = document.getElementById('vinyl-disc');
        if (vinyl) {
            vinyl.classList.remove('spinning');
            vinyl.style.transform = 'translateX(50%) rotate(0deg)';
        }
    }
});

// Floating Player Events
floatingPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (globalAudioPlayer.paused) globalAudioPlayer.play();
    else globalAudioPlayer.pause();
});

floatingCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    globalAudioPlayer.pause();
    floatingPlayer.classList.add('translate-y-48', 'opacity-0');
    currentFloatingPublication = null;
});

floatingProgressContainer.addEventListener('mousedown', (e) => {
    if (!globalAudioPlayer.duration) return;
    const rect = floatingProgressContainer.getBoundingClientRect();
    globalAudioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * globalAudioPlayer.duration;
});

// Init
async function init() {
    try {
        const response = await fetch('publication.json');
        publications = await response.json();
        publications.sort((a, b) => parseDate(b.datetime) - parseDate(a.datetime));
        setupEvents();
        renderTags();
        renderCarousels();
    } catch (e) {
        console.error("Error loading publications", e);
    }
    

}

function parseDate(dateStr) {
    if (!dateStr) return 0;
    const [datePart, timePart] = dateStr.split(' ');
    if(!timePart) return 0;
    const [d, m, y] = datePart.split('/');
    const [h, min, s] = timePart.split(':');
    return new Date(y, m - 1, d, h, min, s).getTime();
}

function showDetail() {
    history.pushState({ view: 'detail' }, '', '#detail');
    viewDetail.classList.remove('hidden');
    viewDetail.classList.add('opacity-0', 'transition-opacity', 'duration-300', 'ease-in-out');
    
    // Trigger reflow
    viewDetail.offsetHeight;
    
    viewDetail.classList.remove('opacity-0');
    viewDetail.classList.add('opacity-100');
    
    setTimeout(() => {
        viewGeneral.classList.add('hidden');
        viewDetail.classList.remove('transition-opacity', 'duration-300', 'ease-in-out', 'opacity-100');
    }, 300);
}

function hideDetail(updateHistory = true) {
    if (updateHistory && history.state && history.state.view === 'detail') {
        history.back();
        return; // popstate listener will handle the actual hiding
    }

    viewGeneral.classList.remove('hidden');
    viewDetail.classList.add('transition-opacity', 'duration-300', 'ease-in-out');
    viewDetail.classList.add('opacity-0');
    
    setTimeout(() => {
        viewDetail.classList.add('hidden');
        viewDetail.classList.remove('transition-opacity', 'duration-300', 'ease-in-out', 'opacity-0');
    }, 300);
}

function setupEvents() {
    window.addEventListener('popstate', (e) => {
        if (!e.state || e.state.view !== 'detail') {
            if (!viewDetail.classList.contains('hidden')) {
                hideDetail(false);
            }
        }
    });

    btnBack.addEventListener('click', () => {
        hideDetail();
    });

    // Toggle dropdown
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tagsDropdown.classList.toggle('hidden');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!tagsDropdown.classList.contains('hidden') && !tagsDropdown.contains(e.target) && e.target !== searchBtn) {
            tagsDropdown.classList.add('hidden');
        }
    });

    // Logo & title click scroll to top / return home / reset filters
    logoTitleContainer.addEventListener('click', () => {
        if (!viewDetail.classList.contains('hidden')) {
            hideDetail();
        }
        
        // Reset tags
        if (activeTags.size > 0) {
            activeTags.clear();
            const headerBtns = document.querySelectorAll('#tags-dropdown button');
            headerBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary', 'shadow-[2px_2px_0px_0px_rgba(234,86,59,1)]');
                b.classList.add('bg-surface', 'shadow-[2px_2px_0px_0px_rgba(28,28,25,1)]');
            });
            renderCarousels();
        }
        
        carouselsContainer.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function renderTags() {
    const allTags = new Set();
    publications.forEach(p => {
        if (p.tags) p.tags.forEach(t => allTags.add(t));
    });

    tagsDropdown.innerHTML = '';
    Array.from(allTags).sort().forEach(tag => {
        const btn = document.createElement('button');
        const randomRot = (Math.random() * 4 - 2).toFixed(2);
        
        btn.className = `asymmetric-tag bg-surface border border-on-surface px-3 py-1 font-label-md text-label-md uppercase shadow-[2px_2px_0px_0px_rgba(28,28,25,1)] cursor-pointer`;
        btn.style.transform = `rotate(${randomRot}deg)`;
        btn.textContent = tag;
        
        btn.onclick = (e) => {
            e.stopPropagation(); // Keep dropdown open when clicking tags
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-[2px_2px_0px_0px_rgba(234,86,59,1)]');
                btn.classList.add('bg-surface', 'shadow-[2px_2px_0px_0px_rgba(28,28,25,1)]');
            } else {
                activeTags.add(tag);
                btn.classList.add('bg-primary', 'text-on-primary', 'shadow-[2px_2px_0px_0px_rgba(234,86,59,1)]');
                btn.classList.remove('bg-surface', 'shadow-[2px_2px_0px_0px_rgba(28,28,25,1)]');
            }
            renderCarousels();
        };
        tagsDropdown.appendChild(btn);
    });
}

function getFilteredPublications() {
    return publications.filter(p => {
        const matchSearch = !searchQuery || 
            (p.titre && p.titre.toLowerCase().includes(searchQuery)) ||
            (p.description_auteur && p.description_auteur.toLowerCase().includes(searchQuery));
        let matchTags = true;
        if (activeTags.size > 0) {
            matchTags = Array.from(activeTags).every(t => p.tags && p.tags.includes(t));
        }
        return matchSearch && matchTags;
    });
}

function createHeroHeaderHtml(p) {
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full mb-md md:mb-lg cursor-pointer group px-margin-safe';
    
    const imgUrl = p.image_url || 'https://via.placeholder.com/800x400?text=Audio';
    
    wrapper.innerHTML = `
        <div class="flex flex-col md:flex-row border-4 border-on-surface brutal-shadow bg-surface-container overflow-hidden transition-transform group-hover:-translate-y-1">
            
            <!-- Left: Image -->
            <div class="w-full md:w-1/2 aspect-video md:aspect-auto bg-cover bg-center relative border-b-4 md:border-b-0 md:border-r-4 border-on-surface overflow-hidden" style="background-image: url('${imgUrl}')">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <!-- Play Button Overlay -->
                <button class="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,28,25,1)] hover:scale-110 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all z-10" onclick="event.stopPropagation(); playFloatingAudio('${p.id}')">
                    <span class="material-symbols-outlined text-4xl card-play-icon" data-audio-id="${p.id}" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                </button>
            </div>
            
            <!-- Right: Content -->
            <div class="w-full md:w-1/2 p-md md:p-lg flex flex-col justify-center bg-on-surface relative overflow-hidden" onclick="openPublication('${p.id}')">
                <div class="mb-sm">
                    <span class="inline-block bg-primary text-on-primary font-label-md px-2 py-1 uppercase tracking-widest text-sm">À la une</span>
                </div>
                <h2 class="font-display-lg text-4xl md:text-5xl lg:text-6xl text-surface leading-none tracking-tight mb-md line-clamp-2">${p.titre}</h2>
                <p class="font-body-lg text-lg text-surface/80 line-clamp-none mb-lg">${p.description_auteur || ''}</p>
                <div class="mt-auto">
                    <p class="font-label-sm text-surface/60 tracking-widest uppercase">${p.datetime ? p.datetime.split(' ')[0] : ''}</p>
                </div>
            </div>
        </div>
        
        <!-- Marquee Bar -->
        <div class="w-full border-4 border-t-0 border-on-surface bg-surface-variant overflow-hidden brutal-shadow relative">
            <div class="whitespace-nowrap py-1.5 flex items-center gap-4 text-on-surface font-label-lg uppercase tracking-[0.2em] text-xs marquee-content opacity-80">
                <span>NOUVEL ÉPISODE</span>
                <span class="text-primary">•</span>
                <span>NOUVEL ÉPISODE</span>
                <span class="text-primary">•</span>
                <span>NOUVEL ÉPISODE</span>
                <span class="text-primary">•</span>
                <span>NOUVEL ÉPISODE</span>
                <span class="text-primary">•</span>
                <span>NOUVEL ÉPISODE</span>
            </div>
        </div>
    `;
    
    return wrapper;
}

function createAssociationBannerHtml(p) {
    const banner = document.createElement('div');
    banner.className = 'w-full mb-md md:mb-lg cursor-pointer group px-0 md:px-margin-safe';
    
    const imgUrl = p.image_url || 'https://via.placeholder.com/800x400?text=Association';
    const rawExcerpt = p.description_auteur || '';
    const excerpt = rawExcerpt.length > 150 ? rawExcerpt.substring(0, 150) + '...' : rawExcerpt;
    
    banner.innerHTML = `
        <div class="flex flex-col md:flex-row-reverse border-4 border-on-surface brutal-shadow bg-surface-container overflow-hidden transition-transform group-hover:-translate-y-1">
            
            <!-- Right/Top: Image -->
            <div class="w-full md:w-1/2 aspect-video md:aspect-auto bg-cover bg-center border-b-4 md:border-b-0 md:border-l-4 border-on-surface" style="background-image: url('${imgUrl}')"></div>
            
            <!-- Left/Bottom: Content -->
            <div class="w-full md:w-1/2 p-md md:p-lg flex flex-col justify-center bg-primary relative overflow-hidden" onclick="openPublication('${p.id}')">
                <div class="mb-sm">
                    <span class="inline-block bg-on-surface text-surface font-label-md px-2 py-1 uppercase tracking-widest text-sm">L'Association</span>
                </div>
                <h2 class="font-display-lg text-4xl md:text-5xl text-on-primary leading-none tracking-tight mb-md line-clamp-2">${p.titre}</h2>
                <p class="font-body-lg text-lg text-on-primary/90 line-clamp-3 mb-md">${excerpt}</p>
                <div class="mt-auto">
                    <button class="px-4 py-2 bg-on-surface text-surface font-label-lg uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,28,25,1)] hover:bg-surface hover:text-on-surface active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">En savoir plus</button>
                </div>
            </div>
        </div>
    `;
    
    return banner;
}

function createFooterHtml(categories, tags) {
    const footer = document.createElement('footer');
    footer.className = 'w-full bg-on-surface text-surface mt-lg py-lg px-margin-safe border-t-8 border-primary flex flex-col gap-lg brutal-shadow z-20 relative';
    
    const catsHtml = categories.map(c => `<li><a href="#section-${c}" class="hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md inline-block py-1">${c}</a></li>`).join('');
    const tagsHtml = tags.map(t => `<li><button class="footer-tag-btn hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md text-left py-1" data-tag="${t}">${t}</button></li>`).join('');
    
    footer.innerHTML = `
        <!-- Top Row: Logo -->
        <div class="flex items-center gap-sm select-none border-b-2 border-on-surface/20 pb-md">
            <img src="alecto.png" alt="Alecto Logo" class="h-12 md:h-16 w-auto object-contain">
            <span class="font-display-lg text-4xl md:text-5xl text-primary font-bold tracking-tighter uppercase">ALEKTO</span>
        </div>
        
        <!-- Bottom Row: Columns -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl w-full">
            <div class="flex flex-col gap-sm">
                <h3 class="font-display-lg text-2xl text-primary mb-4 border-b-2 border-on-surface/20 pb-2">Publications</h3>
                <ul class="flex flex-col gap-2">
                    ${catsHtml}
                </ul>
            </div>
            
            <div class="flex flex-col gap-sm">
                <h3 class="font-display-lg text-2xl text-primary mb-4 border-b-2 border-on-surface/20 pb-2">Explorer</h3>
                <ul class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                    ${tagsHtml}
                </ul>
            </div>
            
            <div class="flex flex-col gap-sm">
                <h3 class="font-display-lg text-2xl text-primary mb-4 border-b-2 border-on-surface/20 pb-2">Aides et contacts</h3>
                <ul class="flex flex-col gap-2">
                    <li><a href="mailto:alecto@caramail.fr" class="hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md inline-block py-1">Nous contacter</a></li>
                    <li><button onclick="openPublication('L666')" class="hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md text-left py-1">Qui sommes-nous</button></li>
                    <li><button onclick="document.getElementById('cookie-modal').classList.remove('hidden'); setTimeout(() => document.getElementById('cookie-modal').classList.remove('opacity-0'), 10);" class="hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md text-left py-1">Gestion des cookies</button></li>
                    <li><button onclick="triggerPwaInstall()" class="hover:text-primary transition-colors text-lg uppercase tracking-wider font-label-md text-left py-1">Installer l'application</button></li>
                </ul>
            </div>
        </div>
    `;
    
    footer.querySelectorAll('.footer-tag-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tag = e.target.getAttribute('data-tag');
            activeTags.clear();
            activeTags.add(tag);
            renderCarousels();
            carouselsContainer.scrollTo({ top: 0, behavior: 'smooth' });
            
            const headerBtns = document.querySelectorAll('#tags-dropdown button');
            headerBtns.forEach(b => {
                if (b.innerText === tag) {
                    b.classList.add('bg-primary', 'text-on-primary', 'shadow-[2px_2px_0px_0px_rgba(234,86,59,1)]');
                    b.classList.remove('bg-surface', 'shadow-[2px_2px_0px_0px_rgba(28,28,25,1)]');
                } else {
                    b.classList.remove('bg-primary', 'text-on-primary', 'shadow-[2px_2px_0px_0px_rgba(234,86,59,1)]');
                    b.classList.add('bg-surface', 'shadow-[2px_2px_0px_0px_rgba(28,28,25,1)]');
                }
            });
        });
    });
    
    return footer;
}

function renderCarousels() {
    carouselsContainer.innerHTML = '';
    
    // HERO HEADER LOGIC
    if (activeTags.size === 0 && !searchQuery) {
        const audios = publications.filter(p => p.type === 'Audio');
        if (audios.length > 0) {
            const heroAudio = audios[audios.length - 1]; // "le plus bas dans le json"
            const heroHtml = createHeroHeaderHtml(heroAudio);
            carouselsContainer.appendChild(heroHtml);
        }
    }
    
    const filtered = getFilteredPublications();
    const grouped = {};
    
    filtered.forEach(p => {
        if (!grouped[p.type]) grouped[p.type] = [];
        grouped[p.type].push(p);
    });

    const typeOrder = { 'Audio': 1, 'Conte': 2, 'Article': 3 };
    Object.keys(grouped).sort((a, b) => {
        return (typeOrder[a] || 99) - (typeOrder[b] || 99) || a.localeCompare(b);
    }).forEach(type => {
        let pubs = grouped[type];
        if(pubs.length === 0) return;

        if (type === 'Article') {
            const l666Index = pubs.findIndex(p => p.id === 'L666');
            if (l666Index !== -1) {
                const l666Pub = pubs[l666Index];
                pubs.splice(l666Index, 1);
                
                const bannerHtml = createAssociationBannerHtml(l666Pub);
                carouselsContainer.appendChild(bannerHtml);
            }
        }
        
        if (pubs.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'group relative mb-xs md:mb-sm scroll-mt-24 md:scroll-mt-32 px-0 md:px-margin-safe';
        wrapper.id = `section-${type}`;

        const titleHeader = document.createElement('div');
        titleHeader.className = 'flex justify-between items-end mb-sm px-4 md:px-0';
        titleHeader.innerHTML = `<h2 class="font-display-lg text-4xl text-primary tracking-tight italic">${type}</h2>`;
        wrapper.appendChild(titleHeader);

        const containerWrap = document.createElement('div');
        containerWrap.className = 'relative';

        const trackContainer = document.createElement('div');
        trackContainer.className = 'carousel-container gap-md pb-xs no-scrollbar items-stretch';
        
        pubs.forEach(p => {
            const card = document.createElement('div');
            card.className = 'carousel-item cursor-pointer flex flex-col h-full';
            
            const imgUrl = p.image_url || 'https://via.placeholder.com/250x180?text=Alekto';
            const dateStr = p.datetime ? p.datetime.split(' ')[0] : '';
            
            if (type === 'Audio') {
                card.classList.add('w-56', 'md:w-64');
                card.innerHTML = `
                    <div class="relative border-2 border-on-surface brutal-shadow bg-surface-container overflow-hidden group/item transition-all hover:-translate-y-1">
                        <div class="aspect-square bg-cover bg-center transition-all" style="background-image: url('${imgUrl}')"></div>
                        <button class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(28,28,25,1)] hover:scale-105 active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all z-10" onclick="event.stopPropagation(); playFloatingAudio('${p.id}')">
                            <span class="material-symbols-outlined text-2xl card-play-icon" data-audio-id="${p.id}" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                        </button>
                    </div>
                    <h3 class="mt-xs font-label-xl text-label-xl uppercase leading-none text-on-surface line-clamp-1">${p.titre}</h3>
                    <p class="font-body-sm text-body-sm italic opacity-70">${dateStr}</p>
                `;
            } else if (type === 'Conte') {
                card.classList.add('w-80', 'md:w-[400px]');
                card.innerHTML = `
                    <div class="relative border-2 border-on-surface brutal-shadow bg-surface-container overflow-hidden group/item transition-all hover:-translate-y-1">
                        <div class="aspect-[2/1] bg-cover bg-center transition-all" style="background-image: url('${imgUrl}')"></div>
                    </div>
                    <h3 class="mt-xs font-label-xl text-label-xl uppercase leading-none text-on-surface line-clamp-1">${p.titre}</h3>
                    <p class="font-body-sm text-body-sm italic opacity-70">${dateStr}</p>
                `;
            } else {
                card.classList.add('w-80', 'md:w-[400px]');
                const rawExcerpt = p.description_auteur || '...';
                const excerpt = rawExcerpt.length > 240 ? rawExcerpt.substring(0, 240) + '...' : rawExcerpt;
                const tagsBadgesHtml = (p.tags || []).slice(0, 2).map(t => 
                    `<span class="bg-primary text-on-primary font-label-sm text-[10px] px-1 py-0.5 uppercase tracking-wider mb-1 inline-block mr-1">${t}</span>`
                ).join('');
                
                if (p.type && p.type.toLowerCase() === 'partition') {
                    card.classList.remove('w-80', 'md:w-[400px]');
                    card.classList.add('w-48', 'md:w-56');
                    card.innerHTML = `
                        <div class="flex flex-col group/item transition-all hover:-translate-y-1 h-full cursor-pointer">
                            <div class="w-full aspect-square bg-cover bg-center border-2 border-on-surface brutal-shadow bg-surface-container" style="background-image: url('${imgUrl}')"></div>
                            <h3 class="font-label-xl text-sm uppercase leading-tight text-on-surface mt-2 text-center line-clamp-2">${p.titre}</h3>
                        </div>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="relative border-2 border-on-surface brutal-shadow bg-surface-container overflow-hidden group/item transition-all hover:-translate-y-1 flex h-48 md:h-56">
                            <div class="w-1/3 h-full bg-cover bg-center border-r-2 border-on-surface" style="background-image: url('${imgUrl}')"></div>
                            <div class="w-2/3 h-full p-2 flex flex-col justify-between bg-surface relative">
                                <div>
                                    <div class="flex flex-wrap">${tagsBadgesHtml}</div>
                                    <h3 class="font-label-xl text-md uppercase leading-tight text-on-surface line-clamp-2 mt-1">${p.titre}</h3>
                                    <p class="font-body-sm text-xs text-on-surface-variant line-clamp-4 md:line-clamp-5 mt-1 leading-tight">${excerpt}</p>
                                </div>
                                <div class="flex justify-between items-end pt-1 mt-1">
                                    <span class="font-label-sm text-[10px] uppercase opacity-70">${dateStr}</span>
                                    <span class="material-symbols-outlined text-primary text-lg">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
            
            card.onclick = () => openPublication(p);
            trackContainer.appendChild(card);
        });

        // Arrows
        const btnPrev = document.createElement('button');
        btnPrev.className = 'absolute left-0 top-1/2 -translate-y-1/2 bg-on-surface text-surface p-2 shadow-[4px_4px_0px_0px_rgba(234,86,59,1)] hover:bg-primary transition-opacity duration-300 hidden md:block z-20 opacity-0 pointer-events-none';
        btnPrev.innerHTML = '<span class="material-symbols-outlined text-3xl">arrow_back</span>';
        btnPrev.onclick = () => trackContainer.scrollBy({left: -300, behavior: 'smooth'});
        
        const btnNext = document.createElement('button');
        btnNext.className = 'absolute right-0 top-1/2 -translate-y-1/2 bg-on-surface text-surface p-2 shadow-[4px_4px_0px_0px_rgba(234,86,59,1)] hover:bg-primary transition-opacity duration-300 hidden md:block z-20 opacity-90';
        btnNext.innerHTML = '<span class="material-symbols-outlined text-3xl">arrow_forward</span>';
        btnNext.onclick = () => trackContainer.scrollBy({left: 300, behavior: 'smooth'});

        const updateArrows = () => {
            if (trackContainer.scrollLeft <= 5) {
                btnPrev.classList.remove('opacity-90');
                btnPrev.classList.add('opacity-0', 'pointer-events-none');
            } else {
                btnPrev.classList.add('opacity-90');
                btnPrev.classList.remove('opacity-0', 'pointer-events-none');
            }
            
            const maxScroll = trackContainer.scrollWidth - trackContainer.clientWidth;
            if (trackContainer.scrollLeft >= maxScroll - 5 || maxScroll <= 0) {
                btnNext.classList.remove('opacity-90');
                btnNext.classList.add('opacity-0', 'pointer-events-none');
            } else {
                btnNext.classList.add('opacity-90');
                btnNext.classList.remove('opacity-0', 'pointer-events-none');
            }
        };

        let scrollRAF;
        trackContainer.addEventListener('scroll', () => {
            if (scrollRAF) window.cancelAnimationFrame(scrollRAF);
            scrollRAF = window.requestAnimationFrame(updateArrows);
        }, { passive: true });
        // Initialize state slightly after insertion to allow layout calculation
        setTimeout(updateArrows, 100);

        containerWrap.appendChild(btnPrev);
        containerWrap.appendChild(trackContainer);
        containerWrap.appendChild(btnNext);
        
        wrapper.appendChild(containerWrap);
        carouselsContainer.appendChild(wrapper);
    });

    if (!globalAudioPlayer.paused) {
        syncAllCardIcons(true);
    }

    if (Object.keys(grouped).length === 0) {
        carouselsContainer.innerHTML = '<p class="text-center font-label-xl">Aucune publication trouvée.</p>';
    } else {
        const allTags = new Set();
        publications.forEach(p => {
            if (p.tags) p.tags.forEach(t => allTags.add(t));
        });
        const allTypes = Array.from(new Set(publications.map(p => p.type).filter(Boolean))).sort();
        const footerHtml = createFooterHtml(allTypes, Array.from(allTags).sort());
        carouselsContainer.appendChild(footerHtml);
    }
}

function openPublication(p) {
    if (typeof p === 'string') {
        p = publications.find(pub => pub.id === p);
        if (!p) return;
    }
    
    if (p.fichier && p.fichier.toLowerCase().endsWith('.pdf')) {
        window.open(p.fichier, '_blank');
        return;
    }

    showDetail();
    
    detailTitle.textContent = p.titre;
    detailContent.innerHTML = '';

    const tagsHtml = (p.tags || []).map(t => {
        const rot = (Math.random() * 4 - 2).toFixed(1);
        return `<span class="px-3 py-1 border-2 border-on-surface bg-surface-container-high font-label-md text-label-md uppercase italic" style="transform: rotate(${rot}deg)">${t}</span>`;
    }).join('');

    // Audio Mode
    if (p.fichier && p.fichier.toLowerCase().endsWith('.mp3')) {
        const imgUrl = p.image_url || 'https://via.placeholder.com/400x400?text=Audio';
        
        detailContent.innerHTML = `
            <div class="w-full h-full flex flex-col items-center p-md overflow-y-auto">
                <div class="w-full flex flex-col items-center my-auto py-8">
                <!-- Vinyl frame -->
                <div class="relative w-full max-w-md aspect-square mb-lg">
                    <!-- The disc -->
                    <div id="vinyl-disc" class="absolute inset-0 bg-on-surface rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-4 border-[#333] transition-transform duration-500 ease-in-out" style="transform: translateX(50%) rotate(0deg);">
                        <div class="absolute inset-1/4 bg-primary rounded-full flex items-center justify-center border-2 border-[#111]">
                            <div class="w-4 h-4 bg-surface rounded-full border border-on-surface"></div>
                        </div>
                    </div>
                    <!-- The sleeve -->
                    <div class="absolute inset-0 border-2 border-on-surface bg-surface shadow-[8px_8px_0px_0px_rgba(28,28,25,1)] overflow-hidden z-10">
                        <img src="${imgUrl}" class="w-full h-full object-cover" alt="Cover">
                    </div>
                </div>

                <!-- Custom Audio Player UI -->
                <div class="w-full max-w-2xl flex flex-col gap-sm mb-md bg-surface p-md border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,28,25,1)]">
                    <div class="flex flex-col gap-xs">
                        <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                            <span id="audio-current">0:00</span>
                            <span id="audio-total">0:00</span>
                        </div>
                        <div id="progress-container" class="h-4 w-full bg-surface-container border-2 border-on-surface cursor-pointer relative">
                            <div id="progress-bar" class="h-full bg-primary" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-center gap-md mt-sm">
                        <button id="play-pause-btn" class="w-16 h-16 bg-primary border-2 border-on-surface flex items-center justify-center text-on-primary shadow-[4px_4px_0px_0px_rgba(28,28,25,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                            <span id="play-icon" class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                        </button>
                    </div>
                </div>
                
                <!-- Meta -->
                <div class="flex flex-wrap justify-center gap-sm mb-md">${tagsHtml}</div>
                <section class="w-full max-w-2xl bg-surface p-md border-l-4 border-primary">
                    <h3 class="font-label-xl text-label-xl uppercase mb-sm">Description</h3>
                    <p class="font-body-lg text-body-lg text-on-surface-variant">${p.description_auteur || ''}</p>
                </section>
                </div>
            </div>
        `;

        setupAudioLogic(p);
    } 
    // Text Mode
    else if (p.contenu) {
        // Drop caps logic: wrap first letter of first paragraph in a span
        let textContent = p.contenu.trim();
        let paragraphs = textContent.split('\\n');
        
        if(paragraphs.length > 0 && paragraphs[0].length > 0) {
            let firstPar = paragraphs[0];
            let firstLetter = firstPar.charAt(0);
            let restOfPar = firstPar.substring(1);
            paragraphs[0] = `<span class="text-6xl font-display-lg text-primary float-left mr-2 leading-none mt-1">${firstLetter}</span>${restOfPar}`;
        }
        
        const formattedContent = paragraphs.map(c => `<p class="mb-md leading-relaxed">${c}</p>`).join('');

        detailContent.innerHTML = `
            <!-- Floating Nav Buttons -->
            <button id="prev-page" class="floating-nav left-4 w-12 h-12 flex items-center justify-center bg-on-surface text-surface brute-border opacity-50" style="pointer-events: none;">
                <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button id="next-page" class="floating-nav right-4 w-12 h-12 flex items-center justify-center bg-on-surface text-surface brute-border">
                <span class="material-symbols-outlined">chevron_right</span>
            </button>

            <div id="reader-scroll" class="horizontal-scroll-container">
                <div class="reader-page">
                    <!-- Page Header Meta -->
                    <div class="mb-lg border-b-2 border-on-surface pb-sm break-inside-avoid">
                        <div class="flex justify-between items-baseline mb-sm">
                            <span class="font-label-md text-on-surface-variant tracking-widest uppercase">${p.datetime}</span>
                            <span class="font-label-md text-on-surface-variant tracking-widest uppercase">${p.description_auteur || ''}</span>
                        </div>
                        <div class="flex flex-wrap gap-xs">${tagsHtml}</div>
                    </div>
                    
                    ${p.image_url ? `<img src="${p.image_url}" class="w-full h-48 md:h-64 object-cover mb-lg border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,28,25,1)] break-inside-avoid" alt="Couverture de l'article">` : ''}
                    
                    <!-- Content -->
                    <div class="text-on-surface font-body-lg text-xl">
                        ${formattedContent}
                    </div>
                </div>
            </div>
            
            <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <span id="page-indicator" class="font-label-md text-label-md bg-surface border-2 border-on-surface px-4 py-2 brute-border">01 / 01</span>
            </div>
        `;
        
        setupReaderLogic();
    }
}

// Logic for custom audio player
function setupAudioLogic(p) {
    // Sync with floating player context
    currentFloatingPublication = p;
    syncFloatingPlayerUI(p);

    if (globalAudioPlayer.src && globalAudioPlayer.src.endsWith(p.fichier)) {
        // Track already loaded
        const vinyl = document.getElementById('vinyl-disc');
        const playIcon = document.getElementById('play-icon');
        const totalEl = document.getElementById('audio-total');
        if (!globalAudioPlayer.paused) {
            playIcon.innerText = 'pause';
            vinyl.style.transform = 'translateX(25%)';
            vinyl.classList.add('spinning');
        }
        if (!isNaN(globalAudioPlayer.duration) && totalEl) {
             totalEl.textContent = formatTime(globalAudioPlayer.duration);
        }
    } else {
        // Load new track
        globalAudioPlayer.src = p.fichier;
    }
    
    const playBtn = document.getElementById('play-pause-btn');
    const progCont = document.getElementById('progress-container');

    if (playBtn) {
        playBtn.onclick = () => {
            if (globalAudioPlayer.paused) {
                currentFloatingPublication = p;
                syncFloatingPlayerUI(p);
                globalAudioPlayer.play();
            } else {
                globalAudioPlayer.pause();
            }
        };
    }

    if (progCont) {
        progCont.onmousedown = (e) => {
            if (!globalAudioPlayer.duration) return;
            const rect = progCont.getBoundingClientRect();
            globalAudioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * globalAudioPlayer.duration;
        };
    }
}

// Logic for horizontal reader
function setupReaderLogic() {
    const container = document.getElementById('reader-scroll');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const indicator = document.getElementById('page-indicator');
    const readerPage = container.querySelector('.reader-page');
    
    let currentPage = 0;
    let totalPages = 1;

    function applyColumnLayout() {
        const w = container.clientWidth;
        const isMobile = window.innerWidth < 768;
        const gap = isMobile ? 48 : 160;
        const colWidth = w - gap;
        readerPage.style.columnWidth = colWidth + 'px';
        readerPage.style.columnGap = gap + 'px';
    }

    function updateUI() {
        applyColumnLayout();
        
        // Reset min-width to measure natural content width
        readerPage.style.minWidth = '';
        void container.scrollWidth; // force reflow
        
        totalPages = Math.max(1, Math.round(container.scrollWidth / container.clientWidth));
        
        // Force exact width so the last page isn't clamped by the browser
        readerPage.style.minWidth = (totalPages * container.clientWidth) + 'px';
        
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;
        
        container.scrollTo({ left: currentPage * container.clientWidth, behavior: 'auto' });
        
        indicator.innerText = `${String(currentPage + 1).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
        
        prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentPage === 0 ? 'none' : 'auto';
        
        const atEnd = currentPage >= totalPages - 1 || totalPages <= 1;
        nextBtn.style.opacity = atEnd ? '0.3' : '1';
        nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }

    nextBtn.onclick = () => {
        applyColumnLayout();
        totalPages = Math.max(1, Math.round(container.scrollWidth / container.clientWidth));
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateUI();
        }
    };
    
    prevBtn.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            updateUI();
        }
    };

    window.addEventListener('resize', () => {
        currentPage = 0;
        updateUI();
    });
    
    // Initial layout — small delay to let images/fonts settle
    applyColumnLayout();
    setTimeout(updateUI, 200);
}

init();
