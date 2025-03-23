import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  maxCapacity: number;
  spotsAvailable: number;
  color?: string;
  date?: string;
  isRecurring?: boolean;
  recurrence?: string;
  recurringDays?: string[];
  recurringEndDate?: string;
}

interface CalendarDay {
  date: number;
  slots: number;
  currentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  fullDate: Date;
}

interface TodayStats {
  totalSlots: number;
  bookings: number;
  availableSpots: number;
  utilization: number;
}

@Component({
  selector: 'app-slot',
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  providers: [DatePipe],  // <-- Add DatePipe here
  templateUrl: './slot.component.html',
  styleUrl: './slot.component.css'
})
export class SlotComponent {
  // UI state
  activeTab: string = 'day-view';
  sideMenuOpen: boolean = false;
  showOverlay: boolean = false;
  profileMenuOpen: boolean = false;
  slotModalOpen: boolean = false;
  deleteModalOpen: boolean = false;
  modalTitle: string = 'Add New Time Slot';
  
  // Data
  currentDate: Date = new Date();
  calendarDate: Date = new Date();
  calendarTitle: string = '';
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  timeSlots: TimeSlot[] = [];
  recurringSlots: TimeSlot[] = [];
  selectedSlot: TimeSlot | null = null;
  todayStats: TodayStats = {
    totalSlots: 6,
    bookings: 37,
    availableSpots: 30,
    utilization: 55
  };
  
  // Forms
  slotForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.slotForm = this.createSlotForm();
  }
  
  ngOnInit(): void {
    this.loadTimeSlots();
    this.loadRecurringSlots();
    this.setupCalendar();
    
    // Close profile menu when clicking outside
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-pic') && !target.closest('.profile-menu') && this.profileMenuOpen) {
        this.profileMenuOpen = false;
      }
    });
  }
  
  // Initialize slot form
  createSlotForm(): FormGroup {
    const form = this.fb.group({
      date: [this.formatDate(this.currentDate), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      capacity: [10, [Validators.required, Validators.min(1)]],
      color: ['primary'],
      isRecurring: [false],
      recurringType: ['daily'],
      recurringEndDate: [''],
      day0: [false],
      day1: [false],
      day2: [false],
      day3: [false],
      day4: [false],
      day5: [false],
      day6: [false]
    });
    
    // Subscribe to isRecurring changes
    form.get('isRecurring')?.valueChanges.subscribe(isRecurring => {
      if (isRecurring) {
        form.get('recurringType')?.setValidators(Validators.required);
        form.get('recurringEndDate')?.setValidators(Validators.required);
      } else {
        form.get('recurringType')?.clearValidators();
        form.get('recurringEndDate')?.clearValidators();
      }
      form.get('recurringType')?.updateValueAndValidity();
      form.get('recurringEndDate')?.updateValueAndValidity();
    });
    
    return form;
  }
  
  // Format date for form input
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Load time slots data
  loadTimeSlots(): void {
    // In a real app, this would fetch from a service
    this.timeSlots = [
      {
        id: '1',
        startTime: '06:00 AM',
        endTime: '07:00 AM',
        description: 'Morning HIIT Session',
        maxCapacity: 15,
        spotsAvailable: 12,
        color: 'primary'
      },
      {
        id: '2',
        startTime: '08:00 AM',
        endTime: '09:30 AM',
        description: 'Yoga Class',
        maxCapacity: 10,
        spotsAvailable: 0,
        color: 'success'
      },
      {
        id: '3',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        description: 'Strength Training',
        maxCapacity: 8,
        spotsAvailable: 5,
        color: 'warning'
      },
      {
        id: '4',
        startTime: '12:00 PM',
        endTime: '01:00 PM',
        description: 'Lunch Break Pilates',
        maxCapacity: 12,
        spotsAvailable: 8,
        color: 'info'
      },
      {
        id: '5',
        startTime: '05:00 PM',
        endTime: '06:30 PM',
        description: 'Evening Cardio Mix',
        maxCapacity: 15,
        spotsAvailable: 3,
        color: 'primary'
      },
      {
        id: '6',
        startTime: '07:00 PM',
        endTime: '08:00 PM',
        description: 'CrossFit Challenge',
        maxCapacity: 10,
        spotsAvailable: 2,
        color: 'danger'
      }
    ];
  }
  
  // Load recurring slots data
  loadRecurringSlots(): void {
    // In a real app, this would fetch from a service
    this.recurringSlots = [
      {
        id: 'r1',
        startTime: '06:00 AM',
        endTime: '07:00 AM',
        description: 'Morning HIIT Session',
        maxCapacity: 15,
        spotsAvailable: 15,
        recurrence: 'Every Monday, Wednesday, Friday'
      },
      {
        id: 'r2',
        startTime: '08:00 AM',
        endTime: '09:30 AM',
        description: 'Yoga Class',
        maxCapacity: 10,
        spotsAvailable: 10,
        recurrence: 'Every Tuesday and Thursday'
      },
      {
        id: 'r3',
        startTime: '12:00 PM',
        endTime: '01:00 PM',
        description: 'Lunch Break Pilates',
        maxCapacity: 12,
        spotsAvailable: 12,
        recurrence: 'Weekdays'
      },
      {
        id: 'r4',
        startTime: '05:00 PM',
        endTime: '06:30 PM',
        description: 'Evening Cardio Mix',
        maxCapacity: 15,
        spotsAvailable: 15,
        recurrence: 'Every Monday, Wednesday, Friday'
      },
      {
        id: 'r5',
        startTime: '07:00 PM',
        endTime: '08:00 PM',
        description: 'CrossFit Challenge',
        maxCapacity: 10,
        spotsAvailable: 10,
        recurrence: 'Every Tuesday and Thursday'
      }
    ];
  }
  
  // Setup calendar
  setupCalendar(): void {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    
    this.calendarTitle = this.datePipe.transform(this.calendarDate, 'MMMM yyyy') || '';
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week the first day falls on (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get days from previous month to fill calendar
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    this.calendarDays = [];
    
    // Add days from previous month
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      this.calendarDays.push({
        date: i,
        slots: 0,
        currentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: new Date(year, month - 1, i)
      });
    }
    
    // Add days from current month
    const today = new Date();
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = 
        today.getDate() === date.getDate() && 
        today.getMonth() === date.getMonth() && 
        today.getFullYear() === date.getFullYear();
      
      const isSelected = 
        this.currentDate.getDate() === date.getDate() && 
        this.currentDate.getMonth() === date.getMonth() && 
        this.currentDate.getFullYear() === date.getFullYear();
      
      // Generate random number of slots for demo
      let slots = 0;
      if (i !== 15 && i !== 16 && i !== 29) {
        slots = Math.floor(Math.random() * 7);
      }
      
      this.calendarDays.push({
        date: i,
        slots: slots,
        currentMonth: true,
        isToday,
        isSelected,
        fullDate: date
      });
    }
    
    // Add days from next month
    const totalDaysShown = 42; // 6 rows of 7 days
    const daysFromNextMonth = totalDaysShown - this.calendarDays.length;
    for (let i = 1; i <= daysFromNextMonth; i++) {
      this.calendarDays.push({
        date: i,
        slots: 0,
        currentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
  }
  
  // UI Interaction Methods
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  openSideMenu(): void {
    this.sideMenuOpen = true;
    this.showOverlay = true;
  }
  
  closeSideMenu(): void {
    this.sideMenuOpen = false;
    this.showOverlay = false;
  }
  
  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
  
  openSlotModal(type: 'add' | 'edit', slot?: TimeSlot): void {
    this.modalTitle = type === 'add' ? 'Add New Time Slot' : 'Edit Time Slot';
    this.slotForm.reset();
    
    // Set default values
    this.slotForm.patchValue({
      date: this.formatDate(this.currentDate),
      capacity: 10,
      color: 'primary',
      isRecurring: false
    });
    
        if (type === 'edit' && slot) {
            this.selectedSlot = slot;
            // Convert time strings to proper format for input
            const startTime = this.convertTimeStringToInputFormat(slot.startTime);
            const endTime = this.convertTimeStringToInputFormat(slot.endTime);
            
            this.slotForm.patchValue({
                description: slot.description,
                capacity: slot.maxCapacity,
                color: slot.color || 'primary',
                startTime: startTime,
                endTime: endTime
            });
            
            if (slot.isRecurring) {
                this.slotForm.patchValue({
                    isRecurring: true,
                    recurringType: slot.recurrence === 'Weekdays' ? 'weekdays' :
                                  slot.recurrence === 'Weekends' ? 'weekends' : 'custom',
                    recurringEndDate: slot.recurringEndDate || ''
                });
                
                // If custom recurrence, set the day checkboxes
                if (slot.recurringDays) {
                    slot.recurringDays.forEach(day => {
                        const dayIndex = this.weekDays.indexOf(day);
                        if (dayIndex !== -1) {
                            this.slotForm.get('day' + dayIndex)?.setValue(true);
                        }
                    });
                }
            }
        }
        
        this.slotModalOpen = true;
    }
    
    closeSlotModal(): void {
        this.slotModalOpen = false;
        this.selectedSlot = null;
    }
    
    openDeleteModal(slot: TimeSlot): void {
        this.selectedSlot = slot;
        this.deleteModalOpen = true;
    }
    
    closeDeleteModal(): void {
        this.deleteModalOpen = false;
        this.selectedSlot = null;
    }
    
    confirmDelete(): void {
        if (this.selectedSlot) {
            // In a real app, you would call a service to delete the slot
            const slotId = this.selectedSlot.id;
            if (this.selectedSlot.isRecurring) {
                this.recurringSlots = this.recurringSlots.filter(slot => slot.id !== slotId);
            } else {
                this.timeSlots = this.timeSlots.filter(slot => slot.id !== slotId);
            }
            
            // Show success notification
            console.log('Time slot deleted successfully');
        }
        
        this.closeDeleteModal();
    }
    
    saveSlot(): void {
        if (this.slotForm.invalid) {
            // Mark all fields as touched to display validation errors
            Object.keys(this.slotForm.controls).forEach(key => {
                const control = this.slotForm.get(key);
                control?.markAsTouched();
            });
            return;
        }
        
        const formValue = this.slotForm.value;
        
        // Format times for display
        const startTime = this.formatTimeForDisplay(formValue.startTime);
        const endTime = this.formatTimeForDisplay(formValue.endTime);
        
        // Create slot object
        const slot: TimeSlot = {
            id: this.selectedSlot ? this.selectedSlot.id : 'ts' + new Date().getTime(),
            startTime: startTime,
            endTime: endTime,
            description: formValue.description,
            maxCapacity: formValue.capacity,
            spotsAvailable: formValue.capacity, // Assume all spots available for new slots
            color: formValue.color,
            date: formValue.date,
            isRecurring: formValue.isRecurring
        };
        
        // Add recurring information if needed
        if (formValue.isRecurring) {
            slot.recurrence = formValue.recurringType;
            slot.recurringEndDate = formValue.recurringEndDate;
            
            // Handle custom days selection
            if (formValue.recurringType === 'custom') {
                const selectedDays: string[] = [];
                for (let i = 0; i < 7; i++) {
                    if (formValue['day' + i]) {
                        selectedDays.push(this.weekDays[i]);
                    }
                }
                slot.recurringDays = selectedDays;
                slot.recurrence = selectedDays.length > 0 ? 'Every ' + selectedDays.join(', ') : 'Custom';
            } else if (formValue.recurringType === 'weekdays') {
                slot.recurrence = 'Weekdays';
            } else if (formValue.recurringType === 'weekends') {
                slot.recurrence = 'Weekends';
            } else if (formValue.recurringType === 'daily') {
                slot.recurrence = 'Daily';
            } else if (formValue.recurringType === 'weekly') {
                slot.recurrence = 'Weekly';
            }
        }
        
        // Save the slot
        if (this.selectedSlot) {
            // Update existing slot
            if (this.selectedSlot.isRecurring) {
                const index = this.recurringSlots.findIndex(s => s.id === this.selectedSlot!.id);
                if (index !== -1) {
                    this.recurringSlots[index] = { ...this.recurringSlots[index], ...slot };
                }
            } else {
                const index = this.timeSlots.findIndex(s => s.id === this.selectedSlot!.id);
                if (index !== -1) {
                    this.timeSlots[index] = { ...this.timeSlots[index], ...slot };
                }
            }
            console.log('Time slot updated successfully');
        } else {
            // Add new slot
            if (formValue.isRecurring) {
                this.recurringSlots.push(slot);
            } else {
                this.timeSlots.push(slot);
            }
            console.log('Time slot added successfully');
        }
        
        this.closeSlotModal();
    }
    
    formatTimeForDisplay(time: string): string {
        if (!time) return '';
        
        try {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (e) {
            return time;
        }
    }
    
    convertTimeStringToInputFormat(timeString: string): string {
        if (!timeString) return '';
        
        try {
            // Convert "08:00 AM" to "08:00"
            const [timePart, ampm] = timeString.split(' ');
            const [hourStr, minuteStr] = timePart.split(':');
            let hour = parseInt(hourStr, 10);
            
            // Convert to 24-hour format
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            } else if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
            
            // Format for input
            return `${hour.toString().padStart(2, '0')}:${minuteStr}`;
        } catch (e) {
            return timeString;
        }
    }
    
    // Calendar navigation methods
    previousMonth(): void {
        this.calendarDate = new Date(
            this.calendarDate.getFullYear(),
            this.calendarDate.getMonth() - 1,
            1
        );
        this.setupCalendar();
    }
    
    nextMonth(): void {
        this.calendarDate = new Date(
            this.calendarDate.getFullYear(),
            this.calendarDate.getMonth() + 1,
            1
        );
        this.setupCalendar();
    }
    
    selectCalendarDay(day: CalendarDay): void {
        // Deselect previously selected day
        this.calendarDays.forEach(d => d.isSelected = false);
        
        // Select the clicked day
        day.isSelected = true;
        
        // Update current date
        this.currentDate = new Date(day.fullDate);
        
        // In a real app, you would load data for this date
        console.log('Selected date:', this.currentDate);
    }
    
    // Quick action methods
    copyYesterdaySchedule(): void {
        console.log('Copying yesterday\'s schedule');
        // In a real app, you would call a service to perform this action
    }
    
    setAvailabilityPattern(): void {
        console.log('Setting availability pattern');
        // In a real app, you would open a modal to configure the pattern
    }
    
    blockTimeOff(): void {
        console.log('Blocking time off');
        // In a real app, you would open a modal to select dates/times to block
    }
    
    openRecurringSlotModal(): void {
        this.modalTitle = 'Add New Recurring Slot';
        this.slotForm.reset();
        
        // Set default values with recurring enabled
        this.slotForm.patchValue({
            date: this.formatDate(this.currentDate),
            capacity: 10,
            color: 'primary',
            isRecurring: true,
            recurringType: 'weekly'
        });
        
        this.slotModalOpen = true;
    }
    
    // Handle window resize for responsive design
    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        // In a real app, you would implement responsive behavior
        const width = window.innerWidth;
        if (width < 768) {
            // Mobile view adjustments
        } else {
            // Desktop view adjustments
        }
    }
}