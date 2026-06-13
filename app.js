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
    const businessNumberInput = document.getElementById("businessNumber");
    const businessCountryCodeSelect = document.getElementById("businessCountryCode");
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
    const summaryBusinessNumber = document.getElementById("summaryBusinessNumber");
    const btnGoBack = document.getElementById("btnGoBack");

    let currentStep = 1;

    // Custom Multiselect logic
    const serviceTypeMultiselect = document.getElementById("serviceTypeMultiselect");
    const serviceTypeHeader = serviceTypeMultiselect.querySelector(".multiselect-header");
    const serviceTypePlaceholder = serviceTypeMultiselect.querySelector(".multiselect-placeholder");
    const serviceTypeCheckboxes = serviceTypeMultiselect.querySelectorAll(".multiselect-options-panel input[type='checkbox']");

    serviceTypeHeader.addEventListener("click", (e) => {
        e.stopPropagation();
        serviceTypeMultiselect.classList.toggle("active");
    });

    // Close multiselect dropdown if clicked outside
    document.addEventListener("click", (e) => {
        if (!serviceTypeMultiselect.contains(e.target)) {
            serviceTypeMultiselect.classList.remove("active");
        }
    });

    function updateMultiselectValue() {
        const checkedValues = [];
        serviceTypeCheckboxes.forEach(cb => {
            if (cb.checked) {
                checkedValues.push(cb.value);
            }
        });

        serviceTypeSelect.value = checkedValues.join(", ");

        if (checkedValues.length === 0) {
            serviceTypePlaceholder.textContent = "Select service type";
            serviceTypePlaceholder.classList.remove("selected-text");
        } else {
            serviceTypePlaceholder.textContent = checkedValues.join(", ");
            serviceTypePlaceholder.classList.add("selected-text");
        }

        // Validate the serviceType hidden field in real time
        validateField(serviceTypeSelect);
    }

    serviceTypeCheckboxes.forEach(cb => {
        cb.addEventListener("change", updateMultiselectValue);
    });

    // 1. Business Number same as Mobile Number logic
    sameAsMobileCheckbox.addEventListener("change", () => {
        if (sameAsMobileCheckbox.checked) {
            businessCountryCodeSelect.value = countryCodeSelect.value;
            businessCountryCodeSelect.disabled = true;
            businessNumberInput.value = mobileInput.value;
            businessNumberInput.disabled = true;
            validateField(businessNumberInput);
        } else {
            businessCountryCodeSelect.disabled = false;
            businessNumberInput.value = "";
            businessNumberInput.disabled = false;
            setFieldState(businessNumberInput, false);
        }
    });

    mobileInput.addEventListener("input", () => {
        if (sameAsMobileCheckbox.checked) {
            businessNumberInput.value = mobileInput.value;
        }
    });

    countryCodeSelect.addEventListener("change", () => {
        if (sameAsMobileCheckbox.checked) {
            businessCountryCodeSelect.value = countryCodeSelect.value;
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

        if (id === "mobileNumber" || id === "businessNumber") {
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
                setFieldState(input, false, "City / Location is required");
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
                setFieldState(input, false, "You must agree to the ELF Conditions of Use and Privacy Notice to proceed");
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
            businessNumber: sameAsMobileCheckbox.checked
                ? (countryCodeSelect.value + " " + mobileInput.value.trim())
                : (businessCountryCodeSelect.value + " " + businessNumberInput.value.trim()),
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
        summaryBusinessNumber.textContent = formData.businessNumber;

        // Animate submission transaction
        form.style.opacity = 0;
        if (reviewSubtext) reviewSubtext.style.opacity = 0;
        // Hide step indicators and form header
        const stepIndicatorHeader = document.querySelector(".step-indicator");
        const formHeader = document.querySelector(".form-header-title");
        if (stepIndicatorHeader) stepIndicatorHeader.style.opacity = 0;
        if (formHeader) formHeader.style.opacity = 0;

        setTimeout(() => {
            form.style.display = "none";
            if (reviewSubtext) reviewSubtext.style.display = "none";
            if (stepIndicatorHeader) stepIndicatorHeader.style.display = "none";
            if (formHeader) formHeader.style.display = "none";

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
    btnGoBack.addEventListener("click", () => {
        form.reset();

        // Reset Custom Multiselect
        serviceTypeCheckboxes.forEach(cb => {
            cb.checked = false;
        });
        serviceTypePlaceholder.textContent = "Select service type";
        serviceTypePlaceholder.classList.remove("selected-text");
        serviceTypeSelect.value = "";

        form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("success-state", "error-state");
            const errLabel = group.querySelector(".error-message");
            if (errLabel) errLabel.style.display = "none";
        });

        // Reset Business Number fields
        businessNumberInput.disabled = false;
        businessCountryCodeSelect.disabled = false;
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
        const formHeader = document.querySelector(".form-header-title");
        if (stepIndicatorHeader) {
            stepIndicatorHeader.style.display = "flex";
            stepIndicatorHeader.style.opacity = 1;
        }
        if (formHeader) {
            formHeader.style.display = "block";
            formHeader.style.opacity = 1;
        }

        setTimeout(() => {
            form.style.opacity = 1;
            updateWizardUI();
        }, 50);
    });

    // ==========================================================================
    // Pet Onboarding Animations (Cursor Companion & Background Interactive Pets)
    // ==========================================================================

    const formContainer = document.querySelector(".form-container-box");

    // 1. Background Peeking Pets Setup
    const bgDog = document.createElement("div");
    bgDog.className = "background-pet-dog";
    bgDog.innerHTML = `
    <svg width="120" height="120" viewBox="0 0 100 100" class="dog-svg">
        <!-- Dog Body/Shoulders peeking -->
        <path d="M 15 100 C 15 75, 85 75, 85 100" fill="#E2A65E" stroke="#1D394A" stroke-width="2.5" />
        <path d="M 35 100 C 35 85, 65 85, 65 100" fill="#FFFFFF" />
        
        <!-- Tail (Behind body) -->
        <path class="bg-pet-tail" d="M 75 80 C 85 75, 95 60, 90 50 C 85 45, 80 60, 75 75" fill="#E2A65E" stroke="#1D394A" stroke-width="2.5" stroke-linejoin="round" />
        <path class="bg-pet-tail" d="M 85 53 C 83 48, 80 60, 75 75" fill="#FFFFFF" />

        <!-- Head group to animate breathing -->
        <g class="bg-pet-head">
            <!-- Dog Ears -->
            <path class="bg-pet-ear-left" d="M 25 40 L 15 15 L 40 30 Z" fill="#E2A65E" stroke="#1D394A" stroke-width="2.5" />
            <path class="bg-pet-ear-left" d="M 27 37 L 20 20 L 37 30 Z" fill="#FFC0B5" />
            
            <path class="bg-pet-ear-right" d="M 75 40 L 85 15 L 60 30 Z" fill="#E2A65E" stroke="#1D394A" stroke-width="2.5" />
            <path class="bg-pet-ear-right" d="M 73 37 L 80 20 L 63 30 Z" fill="#FFC0B5" />

            <!-- Head Base -->
            <ellipse cx="50" cy="55" rx="28" ry="24" fill="#E2A65E" stroke="#1D394A" stroke-width="2.5" />
            <!-- White snout patch -->
            <ellipse cx="50" cy="62" rx="16" ry="12" fill="#FFFFFF" stroke="#1D394A" stroke-width="2" />

            <!-- Eyes Group for tracking -->
            <g class="bg-pet-eye" id="dogEyeGroup" style="transform-origin: 50px 52px; transition: transform 0.1s ease;">
                <circle cx="38" cy="52" r="3.5" fill="#1D394A" />
                <circle cx="37" cy="50" r="1" fill="#FFFFFF" />
                <circle cx="62" cy="52" r="3.5" fill="#1D394A" />
                <circle cx="61" cy="50" r="1" fill="#FFFFFF" />
            </g>

            <!-- Cute eyebrows -->
            <ellipse cx="38" cy="45" rx="3" ry="1.5" fill="#FFFFFF" />
            <ellipse cx="62" cy="45" rx="3" ry="1.5" fill="#FFFFFF" />

            <!-- Nose -->
            <polygon points="50,58 45,54 55,54" fill="#1D394A" />
            <!-- Mouth -->
            <path d="M 46 62 Q 50 65 50 62 Q 50 65 54 62" fill="none" stroke="#1D394A" stroke-width="2" stroke-linecap="round" />
            
            <!-- Blush -->
            <ellipse cx="28" cy="60" rx="3" ry="1.5" fill="#FF7A59" opacity="0.4" />
            <ellipse cx="72" cy="60" rx="3" ry="1.5" fill="#FF7A59" opacity="0.4" />
        </g>
    </svg>
    `;

    const bgCat = document.createElement("div");
    bgCat.className = "background-pet-cat";
    bgCat.innerHTML = `
    <svg width="120" height="120" viewBox="0 0 100 100" class="cat-svg">
        <!-- Cat Body/Shoulders peeking -->
        <path d="M 15 100 C 15 75, 85 75, 85 100" fill="#A8A29E" stroke="#1D394A" stroke-width="2.5" />
        <!-- Stripes on shoulders -->
        <path d="M 25 85 Q 35 83 32 100" stroke="#78716C" stroke-width="2" fill="none" />
        <path d="M 75 85 Q 65 83 68 100" stroke="#78716C" stroke-width="2" fill="none" />
        <path d="M 50 88 C 45 88, 45 100, 50 100 C 55 100, 55 88, 50 88" fill="#FFFFFF" />

        <!-- Cat Tail -->
        <path class="bg-pet-tail" d="M 25 85 C 12 75, 8 55, 12 42 C 16 38, 18 45, 16 55 C 14 65, 20 75, 25 80" fill="#A8A29E" stroke="#1D394A" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Head group to animate tilting -->
        <g class="bg-cat-head">
            <!-- Cat Ears -->
            <path class="bg-pet-ear-left" d="M 25 42 L 12 18 L 38 28 Z" fill="#A8A29E" stroke="#1D394A" stroke-width="2.5" />
            <path class="bg-pet-ear-left" d="M 23 39 L 15 22 L 34 29 Z" fill="#FFC0B5" />
            
            <path class="bg-pet-ear-right" d="M 75 42 L 88 18 L 62 28 Z" fill="#A8A29E" stroke="#1D394A" stroke-width="2.5" />
            <path class="bg-pet-ear-right" d="M 73 39 L 85 22 L 66 29 Z" fill="#FFC0B5" />

            <!-- Head Base -->
            <ellipse cx="50" cy="54" rx="26" ry="22" fill="#A8A29E" stroke="#1D394A" stroke-width="2.5" />
            
            <!-- Cat Face Stripes -->
            <path d="M 50 35 L 50 42" stroke="#78716C" stroke-width="2" />
            <path d="M 45 36 L 47 41" stroke="#78716C" stroke-width="1.5" />
            <path d="M 55 36 L 53 41" stroke="#78716C" stroke-width="1.5" />
            <path d="M 28 54 Q 38 54 36 52" stroke="#78716C" stroke-width="1.5" fill="none" />
            <path d="M 72 54 Q 62 54 64 52" stroke="#78716C" stroke-width="1.5" fill="none" />

            <!-- Eyes Group for tracking -->
            <g class="bg-pet-eye" id="catEyeGroup" style="transform-origin: 50px 50px; transition: transform 0.1s ease;">
                <!-- Beautiful realistic cat eyes (slits) -->
                <ellipse cx="38" cy="50" rx="4.5" ry="4.5" fill="#EAB308" stroke="#1D394A" stroke-width="1" />
                <ellipse cx="38" cy="50" rx="1" ry="3.5" fill="#1D394A" />
                <circle cx="36.5" cy="48.5" r="0.8" fill="#FFFFFF" />

                <ellipse cx="62" cy="50" rx="4.5" ry="4.5" fill="#EAB308" stroke="#1D394A" stroke-width="1" />
                <ellipse cx="62" cy="50" rx="1" ry="3.5" fill="#1D394A" />
                <circle cx="60.5" cy="48.5" r="0.8" fill="#FFFFFF" />
            </g>

            <!-- Nose -->
            <polygon points="50,56 47,53 53,53" fill="#FFC0B5" stroke="#1D394A" stroke-width="1" />
            <!-- Mouth -->
            <path d="M 47 58 C 49 59, 50 58, 50 57 C 50 58, 51 59, 53 58" fill="none" stroke="#1D394A" stroke-width="1.5" stroke-linecap="round" />
            <!-- Whiskers -->
            <line x1="22" y1="58" x2="10" y2="57" stroke="#1D394A" stroke-width="1.2" stroke-linecap="round" />
            <line x1="22" y1="62" x2="9" y2="63" stroke="#1D394A" stroke-width="1.2" stroke-linecap="round" />
            
            <line x1="78" y1="58" x2="90" y2="57" stroke="#1D394A" stroke-width="1.2" stroke-linecap="round" />
            <line x1="78" y1="62" x2="91" y2="63" stroke="#1D394A" stroke-width="1.2" stroke-linecap="round" />

            <!-- Blush -->
            <ellipse cx="30" cy="58" rx="2" ry="1" fill="#FF7A59" opacity="0.3" />
            <ellipse cx="70" cy="58" rx="2" ry="1" fill="#FF7A59" opacity="0.3" />
        </g>
    </svg>
    `;

    if (formContainer) {
        formContainer.appendChild(bgDog);
        formContainer.appendChild(bgCat);

        // Wake up background pets after a slight delay
        setTimeout(() => {
            bgDog.classList.add("active");
            bgCat.classList.add("active");
        }, 300);
    }

    // 2. Background Pet Mouse Interactions
    let mouseX = 0, mouseY = 0;

    if (formContainer) {
        formContainer.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // 1. Shift Background Dog Eyes towards cursor
            const dogRect = bgDog.getBoundingClientRect();
            const dogCenterX = dogRect.left + dogRect.width / 2;
            const dogCenterY = dogRect.top + dogRect.height / 2;
            const dogAngle = Math.atan2(e.clientY - dogCenterY, e.clientX - dogCenterX);
            const dogDist = Math.min(2.5, Math.hypot(e.clientX - dogCenterX, e.clientY - dogCenterY) / 50);
            const dogDx = Math.cos(dogAngle) * dogDist;
            const dogDy = Math.sin(dogAngle) * dogDist;
            const dogEyeGroup = document.getElementById("dogEyeGroup");
            if (dogEyeGroup) {
                dogEyeGroup.style.transform = `translate(${dogDx}px, ${dogDy}px)`;
            }

            // 2. Shift Background Cat Eyes towards cursor
            const catRectElem = bgCat.getBoundingClientRect();
            const bgCatCenterX = catRectElem.left + catRectElem.width / 2;
            const bgCatCenterY = catRectElem.top + catRectElem.height / 2;
            const catAngle = Math.atan2(e.clientY - bgCatCenterY, e.clientX - bgCatCenterX);
            const catDist = Math.min(2.5, Math.hypot(e.clientX - bgCatCenterX, e.clientY - bgCatCenterY) / 50);
            const catDx = Math.cos(catAngle) * catDist;
            const catDy = Math.sin(catAngle) * catDist;
            const catEyeGroup = document.getElementById("catEyeGroup");
            if (catEyeGroup) {
                catEyeGroup.style.transform = `translate(${catDx}px, ${catDy}px)`;
            }
        });

        formContainer.addEventListener("mouseenter", (e) => {
            bgDog.classList.add("active");
            bgCat.classList.add("active");
        });
    }

});
