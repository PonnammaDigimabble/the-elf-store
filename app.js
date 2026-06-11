// Optimized 3-Step Provider Onboarding Application Logic

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.getElementById("vetRegistrationForm");
    const steps = Array.from(document.querySelectorAll(".form-step-panel"));
    const stepNodes = Array.from(document.querySelectorAll(".step-node"));
    const progressFill = document.getElementById("progressFill");
    
    // Step 1 Elements
    const fullNameInput = document.getElementById("fullName");
    const mobileInput = document.getElementById("mobileNumber");
    const emailInput = document.getElementById("emailAddress");
    const cityInput = document.getElementById("city");
    const serviceTypeSelect = document.getElementById("serviceType");
    const countryCodeSelect = document.getElementById("countryCode");

    // Step 2 Elements
    const businessNameInput = document.getElementById("businessName");
    const experienceSelect = document.getElementById("experience");
    const serviceAreaInput = document.getElementById("serviceArea");
    const whatsappInput = document.getElementById("whatsappNumber");
    const sameAsMobileCheckbox = document.getElementById("sameAsMobile");

    // Upload Zone Elements
    const licenseZone = document.getElementById("licenseUploadZone");
    const licenseInput = document.getElementById("licenseFile");
    const licensePreview = document.getElementById("licensePreview");
    
    const photoZone = document.getElementById("photoUploadZone");
    const photoInput = document.getElementById("photoFile");
    const photoPreview = document.getElementById("photoPreview");

    const termsAgreeCheckbox = document.getElementById("termsAgree");

    // Success Screen Elements
    const successScreen = document.getElementById("successScreen");
    const reviewSubtext = document.getElementById("reviewSubtext");
    const summaryRegId = document.getElementById("summaryRegId");
    const summaryName = document.getElementById("summaryName");
    const summaryService = document.getElementById("summaryService");
    const summaryLocation = document.getElementById("summaryLocation");
    const summaryArea = document.getElementById("summaryArea");
    const summaryExperience = document.getElementById("summaryExperience");
    const summaryWhatsApp = document.getElementById("summaryWhatsApp");
    const btnRegisterNew = document.getElementById("btnRegisterNew");

    let currentStep = 1;

    // 1. WhatsApp same as Mobile Number logic
    sameAsMobileCheckbox.addEventListener("change", () => {
        if (sameAsMobileCheckbox.checked) {
            whatsappInput.value = mobileInput.value;
            whatsappInput.disabled = true;
            validateField(whatsappInput);
        } else {
            whatsappInput.value = "";
            whatsappInput.disabled = false;
            setFieldState(whatsappInput, false);
        }
    });

    mobileInput.addEventListener("input", () => {
        if (sameAsMobileCheckbox.checked) {
            whatsappInput.value = mobileInput.value;
        }
    });

    // 2. Form Validation Helper Functions
    function setFieldState(element, isValid, errorMessage = "") {
        const group = element.closest(".form-group");
        if (!group) return;

        const errorLabel = group.querySelector(".error-message");

        if (isValid) {
            group.classList.remove("error-state");
            group.classList.add("success-state");
            if (errorLabel) errorLabel.style.display = "none";
        } else {
            group.classList.remove("success-state");
            group.classList.add("error-state");
            if (errorLabel) {
                if (errorMessage) {
                    errorLabel.textContent = errorMessage;
                }
                errorLabel.style.display = "block";
            }
        }
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function validateField(input) {
        const id = input.id;
        const val = input.value.trim();

        // If field is disabled, it is valid by default (like disabled WhatsApp input)
        if (input.disabled) {
            setFieldState(input, true);
            return true;
        }

        if (input.hasAttribute("required") && !val) {
            setFieldState(input, false);
            return false;
        }

        if (id === "fullName") {
            if (val.length < 2) {
                setFieldState(input, false, "Name must be at least 2 characters long");
                return false;
            }
        }

        if (id === "mobileNumber" || id === "whatsappNumber") {
            if (!/^\d{10}$/.test(val)) {
                setFieldState(input, false, "Please enter a valid 10-digit number");
                return false;
            }
        }

        if (id === "emailAddress") {
            if (!validateEmail(val)) {
                setFieldState(input, false, "Please enter a valid email address");
                return false;
            }
        }

        if (id === "city") {
            if (val.length < 2) {
                setFieldState(input, false, "City is required");
                return false;
            }
        }

        if (id === "serviceArea") {
            if (val.length < 2) {
                setFieldState(input, false, "Service Area is required");
                return false;
            }
        }

        if (id === "termsAgree") {
            if (!input.checked) {
                setFieldState(input, false, "You must agree to the Terms & Conditions to proceed");
                return false;
            }
        }

        // Default valid
        setFieldState(input, true);
        return true;
    }

    // Attach real-time input event listeners for validations
    const textInputs = form.querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], select");
    textInputs.forEach(input => {
        input.addEventListener("input", () => validateField(input));
        input.addEventListener("blur", () => validateField(input));
    });

    const checkboxInputs = form.querySelectorAll("input[type='checkbox']");
    checkboxInputs.forEach(cb => {
        cb.addEventListener("change", () => validateField(cb));
    });

    // 3. Drag-and-Drop File Upload logic (Optional files)
    function setupDragAndDrop(zone, input, previewContainer) {
        zone.addEventListener("click", (e) => {
            if (e.target.closest(".btn-remove-file") || e.target.closest(".file-preview-container")) {
                return;
            }
            input.click();
        });

        // Drag events
        ["dragenter", "dragover"].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add("dragover");
            }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove("dragover");
            }, false);
        });

        zone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                input.files = files;
                handleFiles(files[0], input, previewContainer, zone);
            }
        });

        input.addEventListener("change", () => {
            if (input.files.length > 0) {
                handleFiles(input.files[0], input, previewContainer, zone);
            }
        });
    }

    function handleFiles(file, input, previewContainer, zone) {
        const maxSize = 5 * 1024 * 1024; // 5 MB
        const allowedTypes = input.accept.split(",");

        const fileExt = "." + file.name.split(".").pop().toLowerCase();
        const isValidFormat = allowedTypes.some(type => type.trim() === fileExt);

        if (!isValidFormat) {
            setFieldState(zone, false, `Invalid format. Accepted: ${allowedTypes.join(", ").toUpperCase()}`);
            input.value = "";
            return;
        }

        if (file.size > maxSize) {
            setFieldState(zone, false, "File is too large. Maximum size is 5 MB.");
            input.value = "";
            return;
        }

        setFieldState(zone, true);

        displayFilePreview(file, previewContainer, () => {
            input.value = "";
            previewContainer.innerHTML = "";
            previewContainer.style.display = "none";
            zone.querySelector(".upload-zone-content").style.display = "block";
            zone.closest(".form-group").classList.remove("success-state", "error-state");
        });

        zone.querySelector(".upload-zone-content").style.display = "none";
    }

    function displayFilePreview(file, container, onRemove) {
        container.innerHTML = "";
        container.style.display = "block";

        const previewContent = document.createElement("div");
        previewContent.className = "preview-content";

        const thumb = document.createElement("div");
        thumb.className = "preview-thumb";

        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.borderRadius = "4px";
            
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            thumb.appendChild(img);
        } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
            thumb.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #EF4444;"></i>';
        } else {
            thumb.innerHTML = '<i class="fa-regular fa-file"></i>';
        }

        const details = document.createElement("div");
        details.className = "preview-details";

        const name = document.createElement("div");
        name.className = "preview-name";
        name.textContent = file.name;

        const size = document.createElement("div");
        size.className = "preview-size";
        size.textContent = formatBytes(file.size);

        details.appendChild(name);
        details.appendChild(size);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn-remove-file";
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            onRemove();
        });

        previewContent.appendChild(thumb);
        previewContent.appendChild(details);
        previewContent.appendChild(removeBtn);

        container.appendChild(previewContent);
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    setupDragAndDrop(licenseZone, licenseInput, licensePreview);
    setupDragAndDrop(photoZone, photoInput, photoPreview);

    // 4. Multi-Step Wizard Flow (3 steps)
    function updateWizardUI() {
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });

        stepNodes.forEach((node, index) => {
            const stepNum = index + 1;
            if (stepNum === currentStep) {
                node.classList.add("active");
                node.classList.remove("completed");
            } else if (stepNum < currentStep) {
                node.classList.remove("active");
                node.classList.add("completed");
            } else {
                node.classList.remove("active");
                node.classList.remove("completed");
            }
        });

        // Progress bar updates: Step 1 (33.3%), Step 2 (66.6%), Step 3 (100%)
        const percentage = (currentStep / steps.length) * 100;
        progressFill.style.width = `${percentage}%`;

        // Scroll form section into view smoothly
        const section = document.getElementById("registration-section");
        section.scrollIntoView({ behavior: 'smooth' });
    }

    function validateStepPanel(stepNum) {
        let isPanelValid = true;
        const panel = document.getElementById(`step${stepNum}`);
        if (!panel) return false;

        const inputs = panel.querySelectorAll("input[required], select[required]");
        inputs.forEach(input => {
            const isInputValid = validateField(input);
            if (!isInputValid) {
                isPanelValid = false;
            }
        });

        return isPanelValid;
    }

    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetStep = parseInt(btn.getAttribute("data-next"), 10);
            const sourceStep = targetStep - 1;

            if (validateStepPanel(sourceStep)) {
                currentStep = targetStep;
                updateWizardUI();
            }
        });
    });

    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetStep = parseInt(btn.getAttribute("data-prev"), 10);
            currentStep = targetStep;
            updateWizardUI();
        });
    });

    // 5. Form Submit handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateStepPanel(3)) {
            return;
        }

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const regId = `VSP-2026-${randomNum}`;

        const formData = {
            id: regId,
            fullName: fullNameInput.value.trim(),
            mobile: countryCodeSelect.value + " " + mobileInput.value.trim(),
            email: emailInput.value.trim(),
            city: cityInput.value.trim(),
            serviceType: serviceTypeSelect.value,
            businessName: businessNameInput.value.trim() || "N/A",
            experience: experienceSelect.value,
            serviceArea: serviceAreaInput.value.trim(),
            whatsapp: sameAsMobileCheckbox.checked 
                ? (countryCodeSelect.value + " " + mobileInput.value.trim())
                : (countryCodeSelect.value + " " + whatsappInput.value.trim()),
            submittedAt: new Date().toISOString()
        };

        const registrationsList = JSON.parse(localStorage.getItem("vet_registrations") || "[]");
        registrationsList.push(formData);
        localStorage.setItem("vet_registrations", JSON.stringify(registrationsList));

        // Populate summary ticket values
        summaryRegId.textContent = `ID: ${formData.id}`;
        summaryName.textContent = formData.fullName;
        summaryService.textContent = formData.serviceType;
        summaryLocation.textContent = formData.city;
        summaryArea.textContent = formData.serviceArea;
        summaryExperience.textContent = formData.experience;
        summaryWhatsApp.textContent = formData.whatsapp;

        // Animate submission transaction
        form.style.opacity = 0;
        if (reviewSubtext) reviewSubtext.style.opacity = 0;
        
        // Hide step indicators header
        const stepIndicatorHeader = document.querySelector(".step-indicator");
        if (stepIndicatorHeader) stepIndicatorHeader.style.opacity = 0;

        setTimeout(() => {
            form.style.display = "none";
            if (reviewSubtext) reviewSubtext.style.display = "none";
            if (stepIndicatorHeader) stepIndicatorHeader.style.display = "none";
            
            successScreen.style.display = "block";
            successScreen.style.opacity = 0;
            
            // Fade-in success transition
            let opacityVal = 0;
            const fadeInAnim = setInterval(() => {
                if (opacityVal >= 1) {
                    clearInterval(fadeInAnim);
                } else {
                    opacityVal += 0.1;
                    successScreen.style.opacity = opacityVal;
                }
            }, 30);
            
            const section = document.getElementById("registration-section");
            section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });

    // 6. Handle Register New Provider Button Click
    btnRegisterNew.addEventListener("click", () => {
        form.reset();
        
        form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("success-state", "error-state");
            const errLabel = group.querySelector(".error-message");
            if (errLabel) errLabel.style.display = "none";
        });

        // Reset WhatsApp fields
        whatsappInput.disabled = false;
        sameAsMobileCheckbox.checked = false;

        // Clear files
        licensePreview.innerHTML = "";
        licensePreview.style.display = "none";
        licenseZone.querySelector(".upload-zone-content").style.display = "block";

        photoPreview.innerHTML = "";
        photoPreview.style.display = "none";
        photoZone.querySelector(".upload-zone-content").style.display = "block";

        currentStep = 1;

        successScreen.style.display = "none";
        
        form.style.display = "block";
        if (reviewSubtext) {
            reviewSubtext.style.display = "block";
            reviewSubtext.style.opacity = 1;
        }
        
        const stepIndicatorHeader = document.querySelector(".step-indicator");
        if (stepIndicatorHeader) {
            stepIndicatorHeader.style.display = "flex";
            stepIndicatorHeader.style.opacity = 1;
        }
        
        setTimeout(() => {
            form.style.opacity = 1;
            updateWizardUI();
        }, 50);
    });
});
