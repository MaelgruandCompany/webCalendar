document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,
        events: [],
        select: function(info) {
            openEventModal(info.start, info.end, function(eventData) {
                if (eventData) {
                    calendar.addEvent(eventData);
                }
                calendar.unselect();
            });
        },
        eventClick: function(info) {
            if (confirm("Voulez-vous supprimer cet événement ?")) {
                info.event.remove();
            }
        }
    });

    calendar.render();

    function openEventModal(startDate, endDate, callback) {
        var modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal-content">
                <label>Titre de l'événement:</label>
                <input type="text" id="eventTitle" required>
                <label>Date et heure de début:</label>
                <input type="text" id="startDateTime" required>
                <label>Date et heure de fin:</label>
                <input type="text" id="endDateTime" required>
                <label>Rappel (minutes avant):</label>
                <input type="number" id="reminderMinutes">
                <button id="saveEvent">Enregistrer</button>
                <button id="cancelEvent">Annuler</button>
            </div>
        `;
        document.body.appendChild(modal);

        flatpickr("#startDateTime", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: startDate
        });
        flatpickr("#endDateTime", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: endDate
        });

        document.getElementById("saveEvent").onclick = function() {
            var title = document.getElementById("eventTitle").value;
            var start = document.getElementById("startDateTime").value;
            var end = document.getElementById("endDateTime").value;
            var reminderMinutes = document.getElementById("reminderMinutes").value;

            if (title && start && end) {
                var eventData = {
                    title: title,
                    start: start,
                    end: end,
                    allDay: false
                };

                if (reminderMinutes) {
                    setTimeout(function() {
                        alert('Rappel: ' + title);
                    }, (new Date(start) - new Date()) - reminderMinutes * 60000);
                }

                callback(eventData);
                document.body.removeChild(modal);
            }
        };

        document.getElementById("cancelEvent").onclick = function() {
            document.body.removeChild(modal);
            callback(null);
        };
    }
});
