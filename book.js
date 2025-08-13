// Book page functionality
let currentTrip = null;
let basePrice = 0;
let currentCurrency = 'USD';
let exchangeRates = {
    USD: 1,
    PKR: 278.50,
    SAR: 3.75,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    INR: 83.15,
    CAD: 1.35,
    AUD: 1.52,
    JPY: 150.25
};

let currencySymbols = {
    USD: '$',
    PKR: '₨',
    SAR: 'ر.س',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥'
};

document.addEventListener('DOMContentLoaded', function() {
    // Get trip ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');
    
    if (!tripId) {
        window.location.href = 'catalog.html';
        return;
    }
    
    // Find the trip data
    currentTrip = window.DESTINATIONS.find(dest => dest.id === tripId);
    
    if (!currentTrip) {
        window.location.href = 'catalog.html';
        return;
    }
    
    // Populate trip information
    populateTripInfo(currentTrip);
    
    // Set up event listeners
    setupEventListeners();
    
    // Set minimum date to today
    setMinimumDate();
    
    // Initialize price calculation
    updatePriceCalculation();
    
    // Initialize currency converter
    setupCurrencyConverter();
});

function populateTripInfo(trip) {
    // Hero section
    document.getElementById('tripImage').src = trip.image;
    document.getElementById('tripImage').alt = trip.title;
    document.getElementById('tripTitle').textContent = trip.title;
    document.getElementById('tripLocation').textContent = trip.location;
    document.getElementById('tripRating').textContent = trip.rating.toFixed(1);
    document.getElementById('tripDuration').textContent = `${trip.durationDays} days`;
    document.getElementById('tripPrice').textContent = formatCurrency(trip.price);
    
    // Set base price
    basePrice = trip.price;
    
    // Update page title
    document.title = `Book ${trip.title} - Travel Smart`;
}

function setupEventListeners() {
    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', handleFormSubmission);
    
    // Price calculation triggers
    const travelersSelect = document.getElementById('travelers');
    travelersSelect.addEventListener('change', updatePriceCalculation);
    
    // Additional services checkboxes
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceCalculation);
    });
    
    // Form validation
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function setMinimumDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('travelDate');
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

function updatePriceCalculation() {
    const travelers = parseInt(document.getElementById('travelers').value) || 0;
    const baseTotal = basePrice * travelers;
    
    // Calculate additional services
    let additionalTotal = 0;
    const servicePrices = {
        travelInsurance: 89,
        airportTransfer: 45,
        guidedTour: 120,
        mealPlan: 75
    };
    
    Object.keys(servicePrices).forEach(service => {
        const checkbox = document.querySelector(`input[name="${service}"]`);
        if (checkbox && checkbox.checked) {
            additionalTotal += servicePrices[service] * travelers;
        }
    });
    
    const totalAmount = baseTotal + additionalTotal;
    
    // Update display with current currency
    document.getElementById('basePrice').textContent = formatCurrency(baseTotal);
    document.getElementById('additionalServices').textContent = formatCurrency(additionalTotal);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(event);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Add error styling
    field.classList.add('error');
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

async function handleFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const bookingData = {
        tripId: currentTrip.id,
        tripTitle: currentTrip.title,
        tripLocation: currentTrip.location,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        travelDate: formData.get('travelDate'),
        travelers: parseInt(formData.get('travelers')),
        specialRequests: formData.get('specialRequests'),
        additionalServices: {
            travelInsurance: formData.get('travelInsurance') === 'true',
            airportTransfer: formData.get('airportTransfer') === 'true',
            guidedTour: formData.get('guidedTour') === 'true',
            mealPlan: formData.get('mealPlan') === 'true'
        },
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent.replace(/[^0-9.]/g, '')),
        bookingDate: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="ri-loader-4-line"></i> Processing...';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Booking submitted successfully! We will contact you soon.', 'success');
        
        // Reset form
        event.target.reset();
        updatePriceCalculation();
        
        // Redirect to confirmation page or catalog
        setTimeout(() => {
            window.location.href = 'catalog.html';
        }, 3000);
        
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('There was an error processing your booking. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : 'information-line'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="ri-close-line"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function setupCurrencyConverter() {
    const currencyToggle = document.getElementById('currencyToggle');
    const currencyDropdown = document.getElementById('currencyDropdown');
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    // Toggle dropdown
    currencyToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        currencyDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        currencyDropdown.classList.remove('show');
    });
    
    // Handle currency selection
    currencyOptions.forEach(option => {
        option.addEventListener('click', () => {
            const currency = option.dataset.currency;
            selectCurrency(currency);
            currencyDropdown.classList.remove('show');
        });
    });
    
    // Mark USD as selected by default
    selectCurrency('USD');
}

function selectCurrency(currency) {
    currentCurrency = currency;
    
    // Update toggle button
    document.getElementById('currentCurrency').textContent = currency;
    
    // Update selected state in dropdown
    document.querySelectorAll('.currency-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.currency === currency) {
            option.classList.add('selected');
        }
    });
    
    // Update prices
    updatePriceCalculation();
}

function convertCurrency(amount, fromCurrency = 'USD', toCurrency = currentCurrency) {
    const usdAmount = amount / exchangeRates[fromCurrency];
    return usdAmount * exchangeRates[toCurrency];
}

function formatCurrency(amount, currency = currentCurrency) {
    const symbol = currencySymbols[currency];
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    
    // Format based on currency
    if (currency === 'JPY') {
        return `${symbol}${Math.round(convertedAmount)}`;
    } else if (currency === 'PKR' || currency === 'INR') {
        return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else {
        return `${symbol}${convertedAmount.toFixed(2)}`;
    }
}
