function selectTicket(ticketType) {
    const ticketOptions1 = document.getElementById('popupContainer1');
    const ticketOptions2 = document.getElementById('popupContainer2');
    const ticketOptions3 = document.getElementById('popupContainer3');

    if (ticketType === 'LRT') {
        ticketOptions1.style.display = 'block';
        ticketOptions2.style.display = 'none';
        ticketOptions3.style.display = 'none';
    } else if (ticketType === 'LRT2') {
        ticketOptions1.style.display = 'none';
        ticketOptions2.style.display = 'block';
        ticketOptions3.style.display = 'none';
    } else if (ticketType === 'MRT') {
        ticketOptions1.style.display = 'none';
        ticketOptions2.style.display = 'none';
        ticketOptions3.style.display = 'block';
    }

    const popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'block';
}

function closePopup() {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'none';
}

function bookTicket(option) {
    console.log('Booked Option:', option);
}