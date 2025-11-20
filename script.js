// initialise AOS
AOS.init({duration:700,once:true});

// dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// LIGHTBOX for story images
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
document.querySelectorAll('.story-card').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-img');
    lbImg.src = src;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden','false');
  });
});
lbClose.addEventListener('click', () => {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden','true');
  lbImg.src = '';
});
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose.click(); });

// Simple form validation helper
function showError(el,msg){
  el.classList.add('invalid');
  const err = document.getElementById(el.id + '-err');
  if(err) err.textContent = msg;
}
function clearError(el){
  el.classList.remove('invalid');
  const err = document.getElementById(el.id + '-err');
  if(err) err.textContent = '';
}
function validateEmail(email){
  return /\S+@\S+\.\S+/.test(email);
}

// Volunteer form
const volunteerForm = document.getElementById('volunteerForm');
if(volunteerForm){
  volunteerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('v-fullname');
    const email = document.getElementById('v-email');
    const interest = document.getElementById('v-interest');
    let ok = true;
    if(!name.value.trim()){showError(name,'Please enter your full name');ok=false}else clearError(name);
    if(!validateEmail(email.value)){showError(email,'Please enter a valid email');ok=false}else clearError(email);
    if(!interest.value){showError(interest,'Please select an area of interest');ok=false}else clearError(interest);
    if(ok){
      alert('Thanks ' + name.value.trim() + '! Your volunteer application has been received (demo).');
      volunteerForm.reset();
    }
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('c-name');
    const email = document.getElementById('c-email');
    const type = document.getElementById('c-type');
    const message = document.getElementById('c-message');
    let ok = true;
    if(!name.value.trim()){showError(name,'Please enter your name');ok=false}else clearError(name);
    if(!validateEmail(email.value)){showError(email,'Please enter a valid email');ok=false}else clearError(email);
    if(!type.value){showError(type,'Please choose a message type');ok=false}else clearError(type);
    if(message.value.trim().length < 10){showError(message,'Message must be at least 10 characters');ok=false}else clearError(message);
    if(ok){
      const subject = encodeURIComponent('BFYF - ' + type.value + ' enquiry from ' + name.value);
      const body = encodeURIComponent('Name: ' + name.value + '\nEmail: ' + email.value + '\n\n' + message.value);
      const mailto = `mailto:info@bfyf.org?subject=${subject}&body=${body}`;
      window.location.href = mailto;
    }
  });
}

// Donation form
const donationForm = document.getElementById('donationForm');
if(donationForm){
  document.querySelectorAll('#donationForm button[data-amount]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('d-amount').value = btn.getAttribute('data-amount');
    });
  });
  donationForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('d-name');
    const email = document.getElementById('d-email');
    const amount = document.getElementById('d-amount');
    let ok = true;
    if(!name.value.trim()){showError(name,'Please enter your name');ok=false}else clearError(name);
    if(!validateEmail(email.value)){showError(email,'Please enter a valid email');ok=false}else clearError(email);
    if(!(parseFloat(amount.value) > 0)){showError(amount,'Please enter a valid amount');ok=false}else clearError(amount);
    if(ok){
      alert('Demo: donation of R' + amount.value + ' received. Replace with payment gateway in production.');
      donationForm.reset();
    }
  });
}

// Smooth anchor navigation
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e){
    const target = this.getAttribute('href');
    if(target.length>1){
      e.preventDefault();
      const el = document.querySelector(target);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,null,target);
    }
  });
});

// Initialize Leaflet map
const mapEl = document.getElementById('map');
if(mapEl){
  const map = L.map('map').setView([-26.2041,28.0473],11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  const hubs = [
    {name:'Central Hub', coords:[-26.2041,28.0473],desc:'Main community hub'},
    {name:'North Hub', coords:[-26.1600,28.0300],desc:'After-school programs'},
    {name:'South Hub', coords:[-26.2400,28.0500],desc:'Mentorship centre'}
  ];
  hubs.forEach(h=>{
    L.marker(h.coords).addTo(map).bindPopup(`<strong>${h.name}</strong><br>${h.desc}`);
  });
}

// Accessibility: Escape to close lightbox
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    if(lightbox.classList.contains('show')) lbClose.click();
  }
});

// Progressive reveal fade-up
const faders = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('show'); });
}, {threshold:0.15});
faders.forEach(f=>obs.observe(f));
