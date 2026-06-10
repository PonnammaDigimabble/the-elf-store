// Veterinary Service Provider Registration App Logic

// 1. State and City Data
const stateCityMap = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Kurnool"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "South Delhi", "West Delhi", "East Delhi", "North Delhi", "Karol Bagh"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Tumakuru"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilsa", "Alwar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Noida", "Prayagraj", "Bareilly"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Kharagpur", "Bardhaman", "Malda"]
};

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.getElementById("vetRegistrationForm");
    const steps = Array.from(document.querySelectorAll(".form-step-panel"));
    const stepNodes = Array.from(document.querySelectorAll(".step-node"));
    const progressFill = document.getElementById("progressFill");
    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    
    // Upload Zone Elements
    const licenseZone = document.getElementById("licenseUploadZone");
    const licenseInput = document.getElementById("licenseFile");
    const licensePreview = document.getElementById("licensePreview");
    
    const photoZone = document.getElementById("photoUploadZone");
    const photoInput = document.getElementById("photoFile");
    const photoPreview = document.getElementById("photoPreview");

    // Success Screen Elements
    const successScreen = document.getElementById("successScreen");
    const formHeader = document.querySelector(".form-header");
    const summaryRegId = document.getElementById("summaryRegId");
    const summaryName = document.getElementById("summaryName");
    const summaryRegNo = document.getElementById("summaryRegNo");
    const summaryQual = document.getElementById("summaryQual");
    const summaryClinic = document.getElementById("summaryClinic");
    const summaryLocation = document.getElementById("summaryLocation");
    const summaryConsult = document.getElementById("summaryConsult");
    const btnRegisterNew = document.getElementById("btnRegisterNew");

    let currentStep = 1;

    // 2. Initialize State Dropdown
    Object.keys(stateCityMap).sort().forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    // Handle State change to load Cities
    stateSelect.addEventListener("change", () => {
        const selectedState = stateSelect.value;
        citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
        
        if (selectedState && stateCityMap[selectedState]) {
            stateCityMap[selectedState].sort().forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
            setFieldState(stateSelect, true);
        } else {
            citySelect.disabled = true;
            setFieldState(stateSelect, false);
        }
        // Force evaluation on city selection change
        setFieldState(citySelect, false);
    });

    citySelect.addEventListener("change", () => {
        if (citySelect.value) {
            setFieldState(citySelect, true);
        }
    });

    // 3. Consultation Type Checkbox Exclusive logic ("All of the Above" handling)
    const consultClinic = document.getElementById("consultClinic");
    const consultHome = document.getElementById("consultHome");
    const consultOnline = document.getElementById("consultOnline");
    const consultAll = document.getElementById("consultAll");

    const consultCheckboxes = [consultClinic, consultHome, consultOnline];

    if (consultAll) {
        consultAll.addEventListener("change", () => {
            if (consultAll.checked) {
                // If "All of the Above" is checked, check all others and disable them
                consultCheckboxes.forEach(cb => {
                    cb.checked = true;
                    cb.disabled = true;
                });
            } else {
                // If unchecked, uncheck and enable others
                consultCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = false;
                });
            }
        });
    }

    // 4. Form Validation Helper Functions
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

        if (id === "mobileNumber") {
            if (!/^\d{10}$/.test(val)) {
                setFieldState(input, false, "Please enter a valid 10-digit mobile number");
                return false;
            }
        }

        if (id === "emailAddress") {
            if (!validateEmail(val)) {
                setFieldState(input, false, "Please enter a valid email address");
                return false;
            }
        }

        if (id === "experience") {
            if (val !== "") {
                const expNum = parseInt(val, 10);
                if (isNaN(expNum) || expNum < 0 || expNum > 70) {
                    setFieldState(input, false, "Experience must be a positive number up to 70 years");
                    return false;
                }
            }
        }

        if (id === "licenseFile") {
            if (input.files.length === 0) {
                const zone = document.getElementById("licenseUploadZone");
                setFieldState(zone, false, "Veterinary License Upload is required");
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
    const textInputs = form.querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], input[type='number'], select");
    textInputs.forEach(input => {
        input.addEventListener("input", () => validateField(input));
        input.addEventListener("blur", () => validateField(input));
    });

    const checkboxInputs = form.querySelectorAll("input[type='checkbox']");
    checkboxInputs.forEach(cb => {
        cb.addEventListener("change", () => validateField(cb));
    });

    // 5. Drag-and-Drop File Upload logic
    function setupDragAndDrop(zone, input, previewContainer, isRequired = false) {
        const zoneContent = zone.querySelector(".upload-zone-content");

        // Trigger file input click when zone clicked
        zone.addEventListener("click", (e) => {
            // Prevent click propagation if clicking on the remove button in the preview
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

        // Drop event
        zone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                input.files = files;
                handleFiles(files[0], input, previewContainer, zone, isRequired);
            }
        });

        // Input change event
        input.addEventListener("change", () => {
            if (input.files.length > 0) {
                handleFiles(input.files[0], input, previewContainer, zone, isRequired);
            }
        });
    }

    function handleFiles(file, input, previewContainer, zone, isRequired) {
        const maxSize = 5 * 1024 * 1024; // 5 MB
        const allowedTypes = input.accept.split(",");

        // Validate format extension
        const fileExt = "." + file.name.split(".").pop().toLowerCase();
        const isValidFormat = allowedTypes.some(type => {
            if (type.startsWith(".")) {
                return type === fileExt;
            }
            return false;
        });

        if (!isValidFormat) {
            setFieldState(zone, false, `Invalid format. Accepted: ${allowedTypes.join(", ").toUpperCase()}`);
            input.value = "";
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setFieldState(zone, false, "File is too large. Maximum size is 5 MB.");
            input.value = "";
            return;
        }

        // Successful validation
        setFieldState(zone, true);

        // Display Visual Preview
        displayFilePreview(file, previewContainer, () => {
            // Remove handler callback
            input.value = "";
            previewContainer.innerHTML = "";
            previewContainer.style.display = "none";
            zone.querySelector(".upload-zone-content").style.display = "block";
            
            if (isRequired) {
                setFieldState(zone, false, "This document is required");
            } else {
                zone.closest(".form-group").classList.remove("success-state", "error-state");
            }
        });

        // Hide upload content
        zone.querySelector(".upload-zone-content").style.display = "none";
    }

    function displayFilePreview(file, container, onRemove) {
        container.innerHTML = "";
        container.style.display = "block";

        const previewContent = document.createElement("div");
        previewContent.className = "preview-content";

        const thumb = document.createElement("div");
        thumb.className = "preview-thumb";

        // Check if file is image for thumbnail preview
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

    // Set up drag & drop uploads
    setupDragAndDrop(licenseZone, licenseInput, licensePreview, true);
    setupDragAndDrop(photoZone, photoInput, photoPreview, false);

    // 6. Multi-Step Wizard Flow
    function updateWizardUI() {
        // Hide all steps, show active step
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });

        // Update step nodes indicator
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

        // Update Progress Bar Line width
        // 4 steps mean 3 gaps: 0% at step 1, 33.3% at step 2, 66.6% at step 3, 100% at step 4
        const percentage = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressFill.style.width = `${percentage}%`;

        // Scroll form header into view smoothly
        const section = document.getElementById("registration-section");
        section.scrollIntoView({ behavior: 'smooth' });
    }

    // Validate a specific step panel
    function validateStepPanel(stepNum) {
        let isPanelValid = true;
        const panel = document.getElementById(`step${stepNum}`);
        if (!panel) return false;

        // Validate text inputs, select dropdowns
        const inputs = panel.querySelectorAll("input[required], select[required]");
        inputs.forEach(input => {
            const isInputValid = validateField(input);
            if (!isInputValid) {
                isPanelValid = false;
            }
        });

        // Specific custom validations per step
        if (stepNum === 2) {
            // Experience optional validation
            const expInput = document.getElementById("experience");
            if (expInput && expInput.value !== "") {
                const expVal = validateField(expInput);
                if (!expVal) isPanelValid = false;
            }
        }

        if (stepNum === 4) {
            // License file upload validation
            const licenseVal = validateField(licenseInput);
            if (!licenseVal) isPanelValid = false;

            // Terms agree validation
            const termsInput = document.getElementById("termsAgree");
            const termsVal = validateField(termsInput);
            if (!termsVal) isPanelValid = false;
        }

        return isPanelValid;
    }

    // Bind "Next" button click handlers
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

    // Bind "Back" button click handlers
    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetStep = parseInt(btn.getAttribute("data-prev"), 10);
            currentStep = targetStep;
            updateWizardUI();
        });
    });

    // 7. Form Submit handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validate final step panel
        if (!validateStepPanel(4)) {
            return;
        }

        // Collect Consultation Types
        let selectedConsultations = [];
        if (consultAll && consultAll.checked) {
            selectedConsultations = ["In Clinic", "Home Visit", "Online Consultation"];
        } else {
            document.querySelectorAll("input[name='consultationType']:checked").forEach(cb => {
                if (cb.value !== "All of the Above") {
                    selectedConsultations.push(cb.value);
                }
            });
        }

        if (selectedConsultations.length === 0) {
            // Default to clinic consultation if none selected
            selectedConsultations = ["In Clinic"];
        }

        // Collect Specializations
        const selectedSpecializations = [];
        document.querySelectorAll("input[name='specialization']:checked").forEach(cb => {
            selectedSpecializations.push(cb.value);
        });

        // Build submission object
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const regId = `VSP-2026-${randomNum}`;

        const formData = {
            id: regId,
            fullName: document.getElementById("fullName").value.trim(),
            mobile: document.getElementById("countryCode").value + " " + document.getElementById("mobileNumber").value.trim(),
            email: document.getElementById("emailAddress").value.trim(),
            registrationNo: document.getElementById("regNumber").value.trim(),
            qualification: document.getElementById("qualification").value,
            experience: document.getElementById("experience").value || "0",
            specializations: selectedSpecializations,
            clinicName: document.getElementById("clinicName").value.trim(),
            state: document.getElementById("state").value,
            city: document.getElementById("city").value,
            consultations: selectedConsultations,
            submittedAt: new Date().toISOString()
        };

        // Cache registration details locally (Mocking Database Submission)
        const registrationsList = JSON.parse(localStorage.getItem("vet_registrations") || "[]");
        registrationsList.push(formData);
        localStorage.setItem("vet_registrations", JSON.stringify(registrationsList));

        // Populate summary ticket values
        summaryRegId.textContent = `ID: ${formData.id}`;
        summaryName.textContent = formData.fullName;
        summaryRegNo.textContent = formData.registrationNo;
        summaryQual.textContent = formData.qualification;
        summaryClinic.textContent = formData.clinicName;
        summaryLocation.textContent = `${formData.city}, ${formData.state}`;
        summaryConsult.textContent = formData.consultations.join(", ");

        // Animate submission transaction
        // Fade out form, hide step indicators, and display success details
        form.style.opacity = 0;
        formHeader.style.opacity = 0;
        
        setTimeout(() => {
            form.style.display = "none";
            formHeader.style.display = "none";
            
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
            
            // Scroll to the registration box top
            const section = document.getElementById("registration-section");
            section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });

    // 8. Handle Register New Provider Button Click
    btnRegisterNew.addEventListener("click", () => {
        // Reset form inputs
        form.reset();
        
        // Remove validation status visual classes
        form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("success-state", "error-state");
            const errLabel = group.querySelector(".error-message");
            if (errLabel) errLabel.style.display = "none";
        });

        // Reset dynamic city dropdown
        citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
        citySelect.disabled = true;

        // Reset checkbox dependencies
        consultCheckboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = false;
        });

        // Clear files
        licensePreview.innerHTML = "";
        licensePreview.style.display = "none";
        licenseZone.querySelector(".upload-zone-content").style.display = "block";

        photoPreview.innerHTML = "";
        photoPreview.style.display = "none";
        photoZone.querySelector(".upload-zone-content").style.display = "block";

        // Reset wizard step parameters
        currentStep = 1;

        // Animate restore form UI
        successScreen.style.display = "none";
        
        form.style.display = "block";
        formHeader.style.display = "block";
        
        setTimeout(() => {
            form.style.opacity = 1;
            formHeader.style.opacity = 1;
            updateWizardUI();
        }, 50);
    });
});
