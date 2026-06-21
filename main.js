// Velvet Paws - Premium Pet Grooming Web Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /*--------------------------------------------------------------
  # 1. Sticky Header & Active Link Highlighting on Scroll
  --------------------------------------------------------------*/
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Sticky Header transition
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlighting
    let currentActiveId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // adjust offset for header height
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    if (currentActiveId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run once on load to ensure state is correct
  handleScroll();


  /*--------------------------------------------------------------
  # 2. Mobile Menu Toggle
  --------------------------------------------------------------*/
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNavOverlay.classList.toggle('open');
    document.body.style.overflow = isExpanded ? '' : 'hidden'; // lock scroll when menu open
  };

  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /*--------------------------------------------------------------
  # 3. Scroll Trigger Fade-in Animations
  --------------------------------------------------------------*/
  const fadeInUpElements = document.querySelectorAll('.fade-in-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // offset to trigger slightly before element is fully in view
    };

    const fadeInUpObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // stop observing once animated
        }
      });
    }, observerOptions);

    fadeInUpElements.forEach(element => {
      fadeInUpObserver.observe(element);
    });
  } else {
    // Fallback: show all elements if observer is not supported
    fadeInUpElements.forEach(element => {
      element.classList.add('animated');
    });
  }


  /*--------------------------------------------------------------
  # 4. Testimonials Slider
  --------------------------------------------------------------*/
  const testimonialsWrapper = document.getElementById('testimonialsWrapper');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');
  const sliderDotsContainer = document.getElementById('sliderDots');
  
  let currentSlide = 0;
  const totalSlides = testimonialSlides.length;

  if (totalSlides > 0) {
    // Dynamically generate dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      sliderDotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    const updateSliderPosition = () => {
      testimonialsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const goToSlide = (slideIndex) => {
      currentSlide = (slideIndex + totalSlides) % totalSlides;
      updateSliderPosition();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    nextSlideBtn.addEventListener('click', nextSlide);
    prevSlideBtn.addEventListener('click', prevSlide);

    // Auto slide every 7 seconds
    let slideInterval = setInterval(nextSlide, 7000);

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 7000);
    };

    [prevSlideBtn, nextSlideBtn, sliderDotsContainer].forEach(elem => {
      elem.addEventListener('click', resetInterval);
    });

    // Touch support for swiping on mobile
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50; // min distance in px
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
        resetInterval();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
        resetInterval();
      }
    };
  }


  /*--------------------------------------------------------------
  # 5. Interactive styled Map (Leaflet)
  --------------------------------------------------------------*/
  const spaCoords = [47.6135, -122.3275]; // Pine Street, Seattle
  const mapPlaceholder = document.querySelector('.map-loading-placeholder');

  try {
    // Verify if Leaflet script loaded
    if (typeof L !== 'undefined') {
      const map = L.map('map', {
        center: spaCoords,
        zoom: 15,
        scrollWheelZoom: false
      });

      // CartoDB Positron - Premium, minimalist light gray style map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Custom icon design using Sage Green accent color
      const customPin = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: #7C9E8A;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          position: relative;
        ">
          <div style="
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #7C9E8A;
          "></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = L.marker(spaCoords, { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <h4 style="font-family: 'Outfit', sans-serif; font-weight: 700; margin: 0 0 4px 0; color: #2C2C2C;">Velvet Paws Spa</h4>
          <p style="margin: 0; font-size: 13px; color: #666;">1208 Pine Street, Seattle, WA 98101</p>
        </div>
      `).openPopup();

      // Fade out placeholder when map initializes
      if (mapPlaceholder) {
        mapPlaceholder.style.opacity = '0';
        setTimeout(() => mapPlaceholder.style.display = 'none', 300);
      }
    } else {
      throw new Error('Leaflet library not loaded');
    }
  } catch (error) {
    console.warn('Map initialization failed. Showing backup styled template.', error);
    // Let placeholder remain visible with static fallback
    if (mapPlaceholder) {
      mapPlaceholder.innerHTML = `
        <i data-lucide="map-pin" style="width: 32px; height: 32px; color: #7C9E8A;"></i>
        <strong style="margin-top: 10px; color: #2C2C2C;">Velvet Paws Spa</strong>
        <span style="font-size: 14px; text-align: center; padding: 0 20px;">1208 Pine Street, Seattle, WA 98101</span>
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }


  /*--------------------------------------------------------------
  # 6. Booking Form Validation & Booking Simulation Modal
  --------------------------------------------------------------*/
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalOkBtn = document.getElementById('btnModalOk');

  // Summary labels in modal
  const summaryOwner = document.getElementById('summaryOwner');
  const summaryPet = document.getElementById('summaryPet');
  const summaryService = document.getElementById('summaryService');
  const summaryDate = document.getElementById('summaryDate');
  const summaryPhone = document.getElementById('summaryPhone');

  // Map option service names to human-readable names
  const serviceNames = {
    bath: 'Bath & Blow Dry',
    groom: 'Full Grooming Spa',
    nail: 'Nail Trim & File',
    teeth: 'Teeth Cleaning',
    deshed: 'De-shedding Treatment',
    puppy: "Puppy's First Groom"
  };

  // Helper validation routines
  const validateField = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;

    if (input.required) {
      if (!input.value.trim()) {
        isValid = false;
      }
    }

    if (isValid && input.type === 'tel') {
      // Basic phone format check: min 10 digits
      const phoneDigits = input.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        isValid = false;
      }
    }

    if (isValid && input.type === 'date') {
      // Date must be today or in the future
      const selectedDate = new Date(input.value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        isValid = false;
      }
    }

    if (isValid) {
      group.classList.remove('invalid');
    } else {
      group.classList.add('invalid');
    }

    return isValid;
  };

  // Real-time input listener validation
  const formInputs = bookingForm.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
    });
    input.addEventListener('change', () => {
      validateField(input);
    });
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    formInputs.forEach(input => {
      const fieldValid = validateField(input);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Gather Values
      const ownerNameVal = document.getElementById('ownerName').value;
      const phoneVal = document.getElementById('phone').value;
      const petNameVal = document.getElementById('petName').value;
      const serviceVal = document.getElementById('service').value;
      const dateVal = document.getElementById('date').value;

      // Format Date
      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Populating the modal labels
      summaryOwner.textContent = ownerNameVal;
      summaryPet.textContent = petNameVal;
      summaryService.textContent = serviceNames[serviceVal] || 'Grooming Treatment';
      summaryDate.textContent = formattedDate;
      summaryPhone.textContent = phoneVal;

      // Open Modal
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // lock scroll

      // Save Booking details in local storage for demonstration
      localStorage.setItem('velvetPawsBooking', JSON.stringify({
        ownerName: ownerNameVal,
        phone: phoneVal,
        petName: petNameVal,
        service: serviceVal,
        date: dateVal,
        timestamp: new Date().toISOString()
      }));

      // Reset Form fields
      bookingForm.reset();
      formInputs.forEach(input => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('invalid');
      });
    } else {
      // Scroll to the first invalid element
      const firstInvalid = bookingForm.querySelector('.form-group.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Modal Closing Triggers
  const closeModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = ''; // restore scroll
  };

  closeModalBtn.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });
});
