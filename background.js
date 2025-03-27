document.addEventListener('DOMContentLoaded', () => {
    const floatingSymbols = document.createElement('div');
    floatingSymbols.className = 'floating-symbols';
    document.querySelector('.cyberpunk-bg').appendChild(floatingSymbols);

    const symbols = [
        '🔒', '🔑', '🛡️', '⚠️', '🔐', '📡', '💻', '🌐',
        '01', '}</>', '{/}', 'SSL', 'RSA', 'AES', 'SSH', 'VPN',
        '#!/', '>>>', '<<<', '|||', '###', '$$$', '%%%', '&&&'
    ];

    function createSymbol() {
        const symbol = document.createElement('div');
        symbol.className = 'floating-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}%`;
        const duration = 15 + Math.random() * 10;
        symbol.style.animationDuration = `${duration}s`;
        symbol.style.animationDelay = `${Math.random() * 20}s`;
        
        floatingSymbols.appendChild(symbol);
        
        setTimeout(() => {
            symbol.remove();
        }, duration * 1000);
    }

    // Create initial symbols
    for(let i = 0; i < 20; i++) {
        createSymbol();
    }

    // Add new symbols periodically
    setInterval(createSymbol, 2000);
});
