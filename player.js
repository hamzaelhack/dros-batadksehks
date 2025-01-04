document.addEventListener('DOMContentLoaded', () => {
    // الحصول على معلومات المقطع الصوتي من الرابط
    const urlParams = new URLSearchParams(window.location.search);
    const audioSrc = urlParams.get('src');
    const audioTitle = urlParams.get('title');
    const audioSubtitle = urlParams.get('subtitle');

    // تحديد العناصر
    const audio = document.getElementById('audioElement');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalTimeDisplay = document.querySelector('.total-time');
    const volumeBar = document.querySelector('.volume-bar');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeHandle = document.querySelector('.volume-handle');
    const volumeButton = document.querySelector('.volume-button');
    const repeatButton = document.querySelector('.repeat-button');
    const shuffleButton = document.querySelector('.shuffle-button');
    const waves = document.querySelectorAll('.wave');

    let isPlaying = false;
    let isDragging = false;
    let previousVolume = 1;
    let isRepeat = false;
    let isShuffle = false;

    // استعادة آخر موضع استماع
    if (audioSrc) {
        const lastPosition = localStorage.getItem(`audioPosition_${audioSrc}`);
        if (lastPosition) {
            audio.currentTime = parseFloat(lastPosition);
        }

        // تحديث معلومات المقطع الصوتي
        document.querySelector('.audio-title').textContent = audioTitle || '';
        document.querySelector('.audio-subtitle').textContent = audioSubtitle || '';
        audio.src = audioSrc;
    }

    // حفظ الموضع كل 5 ثواني
    setInterval(() => {
        if (audio.src && !audio.paused) {
            localStorage.setItem(`audioPosition_${audio.src}`, audio.currentTime.toString());
        }
    }, 5000);

    // حفظ الموضع عند إغلاق الصفحة
    window.addEventListener('beforeunload', () => {
        if (audio.src) {
            localStorage.setItem(`audioPosition_${audio.src}`, audio.currentTime.toString());
        }
    });

    // تحديث حالة التشغيل
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            stopWaveAnimation();
        } else {
            audio.play();
            startWaveAnimation();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    }

    // تحديث زر التشغيل
    function updatePlayButton() {
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    // تحريك شريط التقدم
    function updateProgress(e) {
        if (!isDragging) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.right = `${100 - progress}%`;
            updateTimeDisplay();
        }
    }

    // تحديث عرض الوقت
    function updateTimeDisplay() {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }

    // تنسيق الوقت
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // التحكم في مستوى الصوت
    function updateVolume(e) {
        const rect = volumeBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let volume = x / rect.width;
        volume = Math.max(0, Math.min(1, volume));
        audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
        volumeHandle.style.right = `${100 - (volume * 100)}%`;
        updateVolumeIcon(volume);
    }

    // تحديث أيقونة الصوت
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 5v14l-5-5H3V10h4l5-5z" stroke="currentColor" fill="none" stroke-width="2"/>
                <path d="M15 9l6 6M21 9l-6 6" stroke="currentColor" fill="none" stroke-width="2"/>
            </svg>`;
        } else {
            volumeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 5v14l-5-5H3V10h4l5-5z M17 9.5c.9.9 1.5 2.2 1.5 3.5s-.6 2.6-1.5 3.5" stroke="currentColor" fill="none" stroke-width="2"/>
                <path d="M20 7c1.7 1.7 2.7 4 2.7 6.5s-1 4.8-2.7 6.5" stroke="currentColor" fill="none" stroke-width="2"/>
            </svg>`;
        }
    }

    // كتم/تشغيل الصوت
    function toggleMute() {
        if (audio.volume > 0) {
            previousVolume = audio.volume;
            audio.volume = 0;
            volumeFill.style.width = '0%';
            volumeHandle.style.right = '100%';
        } else {
            audio.volume = previousVolume;
            volumeFill.style.width = `${previousVolume * 100}%`;
            volumeHandle.style.right = `${100 - (previousVolume * 100)}%`;
        }
        updateVolumeIcon(audio.volume);
    }

    // تحريك الموجات
    function startWaveAnimation() {
        waves.forEach(wave => {
            wave.style.animationPlayState = 'running';
        });
    }

    function stopWaveAnimation() {
        waves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
        });
    }

    // إضافة مستمعي الأحداث
    playBtn.addEventListener('click', togglePlay);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateTimeDisplay);

    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateProgressDrag(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateProgressDrag(e);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    function updateProgressDrag(e) {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        audio.currentTime = progress * audio.duration;
        progressFill.style.width = `${progress * 100}%`;
        progressHandle.style.right = `${100 - (progress * 100)}%`;
        updateTimeDisplay();
    }

    volumeBar.addEventListener('mousedown', (e) => {
        updateVolume(e);
        document.addEventListener('mousemove', updateVolume);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updateVolume);
        });
    });

    volumeButton.addEventListener('click', toggleMute);

    // التكرار والتشغيل العشوائي
    repeatButton.addEventListener('click', () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat;
        repeatButton.style.color = isRepeat ? 'var(--primary-color)' : '#666';
    });

    shuffleButton.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleButton.style.color = isShuffle ? 'var(--primary-color)' : '#666';
    });

    // تحديث عنوان المقطع الصوتي
    function updateAudioInfo(title, subtitle) {
        document.querySelector('.audio-title').textContent = title;
        document.querySelector('.audio-subtitle').textContent = subtitle;
    }

    // تعيين المقطع الصوتي
    function setAudioSource(src, title, subtitle) {
        audio.src = src;
        updateAudioInfo(title, subtitle);
        if (isPlaying) {
            audio.play();
        }
    }

    // إيقاف الموجات عند تحميل الصفحة
    stopWaveAnimation();

    // دعم التشغيل في الخلفية
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: audioTitle || 'المقطع الصوتي',
            artist: audioSubtitle || '',
            artwork: [
                { src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
                { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
                { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
            ]
        });

        // إضافة أزرار التحكم في الإشعارات
        navigator.mediaSession.setActionHandler('play', () => {
            audio.play();
            playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
            playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        });

        navigator.mediaSession.setActionHandler('seekbackward', () => {
            audio.currentTime = Math.max(audio.currentTime - 10, 0);
        });

        navigator.mediaSession.setActionHandler('seekforward', () => {
            audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
        });
    }

    // تحديث حالة التشغيل في الخلفية
    audio.addEventListener('play', () => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
    });

    audio.addEventListener('pause', () => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    });

    // تحديث وقت التشغيل في الخلفية
    audio.addEventListener('timeupdate', () => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setPositionState({
                duration: audio.duration,
                playbackRate: audio.playbackRate,
                position: audio.currentTime
            });
        }
    });
});
