document.addEventListener('DOMContentLoaded', function() {
    // Logo transition on scroll
    const header = document.querySelector('header');
    const logoContainer = document.querySelector('.logo-container');
    
    // Check if icon logo already exists, if not create it
    let iconLogo = document.querySelector('.icon-logo');
    if (!iconLogo) {
        iconLogo = document.createElement('img');
        iconLogo.src = '/images/icon.png';
        iconLogo.alt = 'Timecode Productions Icon';
        iconLogo.className = 'icon-logo';
        logoContainer.appendChild(iconLogo);
    }
    
    // Throttle function to limit how often scroll events fire
    function throttle(callback, delay) {
        let lastCall = 0;
        return function() {
            const now = new Date().getTime();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback.apply(this, arguments);
            }
        };
    }
    
    // Function to handle scroll events
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 60; // When to start transition
        const mainLogo = document.querySelector('.logo');
        
        // Calculate scroll progress for smooth transition (value between 0 and 1)
        const transitionProgress = Math.min(1, scrollPosition / 150);
        
        if (scrollPosition > scrollThreshold) {
            header.classList.add('scrolled');
            
            // Apply gradual transition based on scroll position
            iconLogo.style.opacity = Math.max(0, (transitionProgress - 0.6) * 2);
            mainLogo.style.opacity = Math.max(0, 1 - transitionProgress);
        } else {
            header.classList.remove('scrolled');
            
            // Reverse the transitions when scrolling back up
            iconLogo.style.opacity = Math.max(0, (transitionProgress - 0.6) * 2);
            mainLogo.style.opacity = 1 - transitionProgress;
        }
    }
    
    // Apply throttled scroll handler
    window.addEventListener('scroll', throttle(handleScroll, 10));
    
    // Initial call to set correct state on page load
    handleScroll();
    
    // Get all video containers
    const videoContainers = document.querySelectorAll('.video-container:not(.empty)');
    
    // Process each video container
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        
        // Function to create a black and white thumbnail from the first frame
        function createThumbnail() {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the first frame of the video to the canvas in grayscale
            context.filter = 'grayscale(100%)';
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert the canvas to a data URL and set it as the video poster
            const thumbnailUrl = canvas.toDataURL('image/png');
            video.setAttribute('poster', thumbnailUrl);
        }
        
        // Load the video to capture the first frame, but don't play it
        video.preload = 'auto';
        video.muted = true;
        
        // Once the video metadata is loaded, we can capture the first frame
        video.addEventListener('loadeddata', function() {
            // Create a black and white thumbnail
            createThumbnail();
            
            // Pause the video after generating the thumbnail
            video.pause();
            video.currentTime = 0;
        });
        
        // Hover events for video container
        container.addEventListener('mouseenter', function() {
            // Play the video when hovered
            video.play();
        });
        
        container.addEventListener('mouseleave', function() {
            // Pause and reset the video when mouse leaves
            video.pause();
            video.currentTime = 0;
        });
        
        // Make the container clickable to navigate to the respective page
        container.addEventListener('click', function() {
            const videoTitle = container.querySelector('.video-title').textContent.toLowerCase();
            window.location.href = videoTitle + '.html';
        });
    });
    
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuItems = document.querySelector('.menu-items');
    
    hamburgerMenu.addEventListener('click', function() {
        // Toggle menu visibility
        if (menuItems.style.display === 'block') {
            menuItems.style.display = 'none';
        } else {
            menuItems.style.display = 'block';
            
            // Populate menu items dynamically based on video titles
            if (!menuItems.hasChildNodes()) {
                const menuList = document.createElement('ul');
                
                videoContainers.forEach(container => {
                    const title = container.querySelector('.video-title').textContent;
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    
                    link.href = title.toLowerCase() + '.html';
                    link.textContent = title;
                    
                    listItem.appendChild(link);
                    menuList.appendChild(listItem);
                });
                
                menuItems.appendChild(menuList);
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.hamburger-menu') && !event.target.closest('.menu-items')) {
            menuItems.style.display = 'none';
        }
    });
});