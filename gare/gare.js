import supabase from '../supabaseClient.js'
document.querySelectorAll('.gare-form input').forEach(input => {
  input.setAttribute('autocomplete', 'off');
});
document.getElementById('gareForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    fetchStations();
    const gareName = document.getElementById('gare_name').value;e
    const tnrSupp = document.getElementById('tnr_supp').checked ? 1 : 0;
    const atlasSupp = document.getElementById('atlas_supp').checked ? 1 : 0;
    const alboraqSupp = document.getElementById('alboraq_supp').checked ? 1 : 0;
    const data = {
        gare_name: gareName,
        tnr_supp: tnrSupp,
        atlas_supp: atlasSupp,
        alboraq_supp: alboraqSupp
    };

    const { error } = await supabase
        .from('gare')
        .insert([data]);

    if (error) {
        console.error("Database error:", error);
        const messageBox = document.getElementById('messageBox');
        messageBox.style.display = 'block';
        messageBox.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
        messageBox.innerHTML = `Error inserting data: ${error.message}`;
    } else {
        const messageBox = document.getElementById('messageBox');
        messageBox.style.display = 'block';
        messageBox.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
        messageBox.innerHTML = `Station "${gareName}" has been added successfully!`;rm
        this.reset();
    }
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
});
async function fetchStations() {
    const { data, error } = await supabase
        .from('gare')
        .select('*')
        .order('gare_id', { ascending: false });

    if (error) {
        console.error('Error fetching stations:', error);
        return;
    }

    const tableBody = document.querySelector('#gareTable tbody');
    tableBody.innerHTML = ''; // Clear previous

    data.forEach(station => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${station.gare_name}</td>
            <td>${station.tnr_supp ? '✔️' : '❌'}</td>
            <td>${station.atlas_supp ? '✔️' : '❌'}</td>
            <td>${station.alboraq_supp ? '✔️' : '❌'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Call on page load
fetchStations();

// Also call after insert
document.getElementById('gareForm').addEventListener('submit', async function(e) {
    // your existing code...
    if (!error) {
        fetchStations(); // refresh table after success
    }
});
