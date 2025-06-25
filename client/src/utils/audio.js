export function initAudio(k) {
    // Global audio control
    window.audioEnabled = false; // Start muted to comply with browser policies
    
    // Try to start background music
    function startBackgroundMusic() {
        if (window.audioEnabled) {
            try {
                const music = k.play('background', {
                    volume: 0.2,
                    loop: true
                });
                console.log('Background music started');
            } catch (e) {
                console.log('Background music failed to start:', e);
            }
        }
    }

    // Enable audio on first user interaction
    function enableAudio() {
        window.audioEnabled = true;
        startBackgroundMusic();
        console.log('Audio enabled');
        
        // Remove listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    }

    // Listen for first user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    // Audio toggle function (can be called from anywhere)
    window.toggleAudio = () => {
        window.audioEnabled = !window.audioEnabled;
        console.log('Audio', window.audioEnabled ? 'enabled' : 'disabled');
        
        if (window.audioEnabled) {
            startBackgroundMusic();
        }
    };
}
