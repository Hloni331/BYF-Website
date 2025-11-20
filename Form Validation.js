document.addEventListener('DOMContentLoaded', () => {
  const enquiryForm = document.getElementById('enquiryForm');
  const contactForm = document.getElementById('contactForm');

  function validateForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input, textarea, select').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.border = "2px solid red";
        } else {
          field.style.border = "1px solid #ccc";
        }
      });
      if (valid) {
        alert("Form submitted successfully!");
        form.reset();
      }
    });
  }

  if (enquiryForm) validateForm(enquiryForm);
  if (contactForm) validateForm(contactForm);
});
