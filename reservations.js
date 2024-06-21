class Customer {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    get info() {
        return `${this.name} (${this.email})`;
    }
}

class Reservation {
    constructor(id, customer, date, guests) {
        this.id = id;
        this.customer = customer;
        this.date = new Date(date);
        this.guests = guests;
    }

    get info() {
        return `Reserva para ${this.customer.info} el ${this.date.toLocaleString()} para ${this.guests} ${this.guests > 1 ? 'personas' : 'persona'}`;
    }

    static validate(reservationData) {
        const now = new Date();
        const reservationDate = new Date(reservationData.date);
        return reservationDate > now && reservationData.guests > 0;
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const navbarBurger = document.querySelector(".navbar-burger");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const addReservationItem = document.querySelector(".navbar-item.add-reservation");

    navbarBurger.addEventListener("click", () => {
        navbarBurger.classList.toggle("is-active");
        sidebarMenu.classList.toggle("is-active");
        if (sidebarMenu.style.display === "none" || sidebarMenu.style.display === "") {
            sidebarMenu.style.display = "block";
        } else {
            sidebarMenu.style.display = "none";
        }
    });

    addReservationItem.addEventListener("click", () => {
        if (sidebarMenu.style.display === "none" || sidebarMenu.style.display === "") {
            sidebarMenu.style.display = "block";
        } else {
            sidebarMenu.style.display = "none";
        }
    });

    document.getElementById("reservation-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate = document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        const reservationData = {
            date: reservationDate,
            guests: guests,
        };

        if (Reservation.validate(reservationData)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
            document.getElementById("reservation-form").reset();
            sidebarMenu.style.display = "none";
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

    const restaurant = new Restaurant("El Lojal Kolinar");

    const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
    const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

    if (Reservation.validate({ date: reservation1.date, guests: reservation1.guests })) {
        restaurant.addReservation(reservation1);
        restaurant.render();
    } else {
        alert("Datos de reserva inválidos");
    }
});

