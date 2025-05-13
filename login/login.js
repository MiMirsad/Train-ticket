import supabase from '/supabaseClient.js'
document.querySelectorAll('.reg input').forEach(input => {
  input.setAttribute('autocomplete', 'off');
});
export async function HashPassword(pass) {
    try{
        const encoder = new TextEncoder();
        const data = encoder.encode(pass);
 const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}


export async function comparePassword(plainPassword, hashedPassword) {
  try {
    const hashedInput = await HashPassword(plainPassword);
    return hashedInput === hashedPassword;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
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
}
document.getElementById('lgnb').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const username = document.getElementById("Username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    if (!username || !pass) {
      showMessage('Input Error', 'Please enter both username and password');
      return;
    }
    const { data, error } = await supabase
      .from('personnellee')
      .select('*')
      .ilike('username', username);
    
    console.log('Supabase raw response:', { data, error });
    
    if (error) {
      console.error('Database query error:', error);
      showMessage('Login Error', 'An error occurred during login. Please try again.');
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No matching users found');
      showMessage('Login Failed', 'Invalid username or password');
      return;
    }
    
    // Find exact match first (in case of similar usernames)
    let userData = data.find(user => 
      user.username.trim().toLowerCase() === username
    );
    
    // If no exact match, use the first result
    if (!userData) {
      console.log('No exact match found, using first result');
      userData = data[0];
    } else {
      console.log('Exact match found');
    }
    
    console.log('User data retrieved:', { ...userData, password: '[REDACTED]' });
    
    const storedHashedPassword = userData.password;
    
    if (!storedHashedPassword) {
      console.error('No password found in database record');
      showMessage('Account Error', 'Account error. Please contact support.');
      return;
    }
    
    console.log('Comparing passwords...');
    const isMatch = await comparePassword(pass, storedHashedPassword);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      console.log('Login successful, user type:', userData.type);
      showMessage('Success', 'Login successful!', () => {
        // Redirect after the user closes the message
        if (userData.type === 'admin') {
          console.log('Redirecting to admin page');
          window.location.href = './admin/admin.html';
        } else if (userData.type === 'user') {
          console.log('Redirecting to user page');
          window.location.href = './user/user.html';
        } else {
          console.log('Redirecting to default dashboard');
          window.location.href = './dashboard.html'; // Default redirect
        }
      });
    } else {
      console.log('Password verification failed');
      showMessage('Login Failed', 'Invalid password');
    }
  } catch (err) {
    console.error('Login error:', err);
    showMessage('Error', 'An error occurred during login. Please try again.');
  }
});
function showMessage(title, message, callback = null) {
  const modal = document.getElementById('msgModal');
  const titleElement = document.getElementById('msgTitle');
  const textElement = document.getElementById('msgText');
  const okButton = document.getElementById('msgOkBtn');
  const closeBtn = document.querySelector('.close-btn');
  
  titleElement.textContent = title;
  textElement.textContent = message;
  modal.style.display = 'block';
  
  // Handle close button click
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    if (callback) callback();
  };
  
  // Handle OK button click
  okButton.onclick = function() {
    modal.style.display = 'none';
    if (callback) callback();
  };
  
  // Close when clicking outside
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      if (callback) callback();
    }
  };
}