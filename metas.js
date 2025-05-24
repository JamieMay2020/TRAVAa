// Add 'metas' to your page switching logic
function initMetasPage() {
    // Set the date when metas page loads
    const metasDate = document.getElementById('metasDate');
    if (metasDate) {
        metasDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}