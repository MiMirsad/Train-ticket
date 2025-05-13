import supabase from '/supabaseClient.js'

const isBcryptAvailable = typeof bcrypt !== 'undefined';
document.querySelectorAll('.reg input').forEach(input => {
  input.setAttribute('autocomplete', 'off');
});
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
  field.classList.add("shake", "invalid");
  container.classList.add("shake");
  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field.focus();
  setTimeout(() => {
    field.classList.remove("shake");
    container.classList.remove("shake");
  }, 500);
}document.getElementById('Regsiterbutn').addEventListener('click', async function (e) {
  e.preventDefault();
  
  // Validate all fields are filled
  const inputs = document.querySelectorAll('.reg input');
  let isValid = true;
  let firstInvalidField = null;
  
  // First clear previous invalid markers
  inputs.forEach(input => {
    input.classList.remove("invalid");
  });
  
  // Check if any fields are empty
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("invalid");

      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    }
  });

  // If any field is empty, highlight and return
  if (!isValid) {
    if (firstInvalidField) {
      highlightField(firstInvalidField.id);
    }
    showMessage("Error", "Please fill in all fields", true);
    return;
  }
  
  // Validate username is not taken
  const waitforfunction = await checkIfUsernameIsUsed();
  if (waitforfunction === false) {
    showMessage("Error", "Username is already in use", true);
    return;
  }
  
  // Validate phone number
  const checknum = await checkTelephone();
  if (checknum === false) {
    showMessage("Error", "Please enter a valid phone number", true);
    return;
  }
  
  // Validate email
  const email = document.getElementById("email").value;
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    showMessage("Error", "Invalid email address", true);
    return;
  }

  try {
    // Hash password and security answer
    const rawpass = document.getElementById("pass").value;
    const hashedpass = await HashPassword(rawpass);

    const rawanswer = document.getElementById("answr").value;
    const hashedanswer = await Hashanwsr(rawanswer);
    
    // Create data object
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
      email: email,  // Fixed: use the actual email instead of validation result
    };

    console.log("Submitting registration data:", { ...data, password: "[REDACTED]", securti_anwser: "[REDACTED]" });

    // Insert data into Supabase
    const { error } = await supabase
      .from('personnellee')
      .insert([data]);

    if (error) {
      console.error("Database error:", error);
      showMessage("Registration Error", 'Error inserting data: ' + error.message, true);
    } else {
      showMessage("Success", 'Registration successful!');
      // Clear form fields
      [
        "Nom", "Prenom", "user", "pass", "Ville",
        "Adress", "Tel", "Cin", "qts", "answr", "email"
      ].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    showMessage("Error", 'An error occurred: ' + err.message, true);
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
