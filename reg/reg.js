import supabase from '/supabaseClient.js'

const isBcryptAvailable = typeof bcrypt !== 'undefined';

export async function HashPassword(password) {
  if (isBcryptAvailable) {
    //check if bcrypte is working
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  } else {
    // Fallback to Web Crypto API
    console.warn("bcrypt not available, using Web Crypto API instead");
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
async function Hashanwsr(answer) {
  const encoder = new TextEncoder();
  const data = encoder.encode(answer);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
async function checkIfUsernameIsUsed() {
  const username = document.getElementById("user").value.trim();
  const { data, error } = await supabase
    .from("personnellee")
    .select("username")
    .ilike("username", username);

  if (error) {
    console.error(error);
    return false;
  }

  return data.length === 0; 
}

function checkTelephone() {
  const tel = document.getElementById('Tel').value;
  return !isNaN(tel) && tel.trim() !== "";
}
const Regsiterbutn = document.getElementById('Regsiterbutn');

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function highlightField(fieldId) {
  const field = document.getElementById(fieldId);
  const container = document.querySelector('.reg');
  
  // Add shake animation
  field.classList.add("shake", "invalid");
  container.classList.add("shake");
  
  // Scroll to the field and focus
  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field.focus();
  
  // Remove shake animation after 500ms
  setTimeout(() => {
    field.classList.remove("shake");
    container.classList.remove("shake");
  }, 500);
}

document.getElementById('Regsiterbutn').addEventListener('click', async function (e) {
  e.preventDefault();
  

  const inputs = document.querySelectorAll('.reg input');
  let isValid = true;
  let firstInvalidField = null;

  inputs.forEach(input => {
    input.classList.remove("invalid");
  });

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("invalid");

      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    }
  });

  if (!isValid) {
    if (firstInvalidField) {
      highlightField(firstInvalidField.id);
    }
    showMessage("Please fill in all fields", true);
    return;
  }
  
  const waitforfunction = await checkIfUsernameIsUsed();
  if (waitforfunction === false) {
    showMessage("Username is already in use", true);
    return;
  }
  
  const checknum = await checkTelephone();
  if (checknum === false) {
    showMessage("Please enter a valid phone number", true);
    return;
  }
  

  showMessage("Registration successful!", false);
});


Regsiterbutn.addEventListener('click', async function (e) {
  e.preventDefault();

  const waitforfunction = await checkIfUsernameIsUsed();
  if (waitforfunction === false) {
    showMessage("username is already in use", true);
    return;
  }

  const checknum = await checkTelephone();
  if (checknum === false) {
    showMessage("Please enter a valid phone number", true);
    return;
  }

  try {
    const rawpass = document.getElementById("pass").value;
    const hashedpass = await HashPassword(rawpass);

    const rawanswer = document.getElementById("answr").value;
    const hashedanswer = await Hashanwsr(rawanswer);
  const email = document.getElementById("email").value;
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    showMessage("Invalid email address", true);
    return;
  }
    const data = {
      pers_nom: document.getElementById("Nom").value,
      pers_prenom: document.getElementById("Prenom").value,
      username: document.getElementById("user").value,
      password: hashedpass,
      pers_ville: document.getElementById("Ville").value,
      pers_adress: document.getElementById("Adress").value,
      pers_tel: document.getElementById("Tel").value,
      pers_cin: document.getElementById("Cin").value,
      type: document.getElementById("Type").value,
      securti_question: document.getElementById("qts").value,
      securti_anwser: hashedanswer,
          email: valdem,
    };

    const { error } = await supabase
      .from('personnellee')
      .insert([data]);

    if (error) {
      showMessage('Error inserting data: ' + error.message, true);
    } else {
      showMessage('Registration successful!');
      [
        "Nom", "Prenom", "user", "pass", "Ville",
        "Adress", "Tel", "Cin", "qts", "answr"
      ].forEach(id => document.getElementById(id).value = "");
    }
  } catch (err) {
    showMessage('An error occurred: ' + err.message, true);
    console.error('Registration error:', err);
  }
});


const messageBox = document.getElementById('messageBox');

function showMessage(text, isError = false) {
  messageBox.style.display = 'block';
  messageBox.textContent = text;
  messageBox.style.backgroundColor = isError ? '#ffe0e0' : '#e0ffe0';
  messageBox.style.color = isError ? '#b00020' : '#007700';
  messageBox.style.border = isError ? '1px solid #b00020' : '1px solid #007700';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 5000);
}
