import { Component } from '@angular/core';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {


  constructor() {}

  // Menu Toggle
  toggleSideMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    sideMenu?.classList.add("open");
    overlay?.classList.add("show");
  }

  closeSideMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    sideMenu?.classList.remove("open");
    overlay?.classList.remove("show");
  }

  closeOverlay() {
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    const profileMenu = document.getElementById("profileMenu");
    sideMenu?.classList.remove("open");
    overlay?.classList.remove("show");
    profileMenu?.classList.remove("show");
  }

  // Profile Menu Toggle
  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    const profileMenu = document.getElementById("profileMenu");
    profileMenu?.classList.toggle("show");
  }

  // New Booking Modal
  openBookingModal() {
    const newBookingModal = document.getElementById("newBookingModal");
    newBookingModal?.classList.add("show");
  }

  closeBookingModal() {
    const newBookingModal = document.getElementById("newBookingModal");
    newBookingModal?.classList.remove("show");
  }

  cancelBooking() {
    const newBookingModal = document.getElementById("newBookingModal");
    newBookingModal?.classList.remove("show");
  }

  // Calendar Day Selection
  selectDay(event: Event, dayElement: HTMLElement) {
    const calendarDays = document.querySelectorAll(".calendar-day");
    calendarDays.forEach(d => d.classList.remove("active"));
    dayElement.classList.add("active");
  }

  // Filter Selection
  selectFilter(event: Event, filterItem: HTMLElement) {
    const filterItems = document.querySelectorAll(".filter-item");
    filterItems.forEach(item => item.classList.remove("active"));
    filterItem.classList.add("active");
  }

  // Time Slot Selection
  selectTimeSlot(event: Event, timeSlotElement: HTMLElement) {
    const timeSlots = document.querySelectorAll(".time-slot:not(.booked)");
    timeSlots.forEach(slot => slot.classList.remove("active"));
    timeSlotElement.classList.add("active");
  }

  // Detect clicks outside of profile menu to close it
  closeProfileMenuOutside(event: Event) {
    const profilePic = document.getElementById("profilePic");
    const profileMenu = document.getElementById("profileMenu");
    if (profilePic && !profilePic.contains(event.target as Node)) {
      profileMenu?.classList.remove("show");
    }
  }

  ngOnInit() {
    document.addEventListener("click", (event) => this.closeProfileMenuOutside(event));
  }

  ngOnDestroy() {
    document.removeEventListener("click", (event) => this.closeProfileMenuOutside(event));
  }
}
