import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sideMenuOpen: boolean = false;
  profileMenuOpen: boolean = false;
  sideMenuItems: NodeListOf<Element> | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Initial setup
    this.sideMenuItems = this.el.nativeElement.querySelectorAll('.side-menu-item');
    this.addSideMenuItemClickListeners();
    
    // Add document click handler for closing profile menu
    this.renderer.listen('document', 'click', (event) => {
      // Skip if the menu isn't open
      if (!this.profileMenuOpen) return;
      
      // Find the profile elements
      const profilePic = this.el.nativeElement.querySelector('.profile-pic');
      const profileMenu = this.el.nativeElement.querySelector('.profile-menu');
      
      // Check if the click was outside both elements
      if (profilePic && profileMenu && 
          !profilePic.contains(event.target) &&
          !profileMenu.contains(event.target)) {
        this.profileMenuOpen = false;
      }
    });
  }

  // Menu functionality
  openMenu(): void {
    this.sideMenuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu(): void {
    this.sideMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  // Profile menu functionality
  toggleProfileMenu(event: Event): void {
    // Stop event propagation to prevent immediate closing
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // Navigation functionality
  setActiveNavItem(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    this.sideMenuItems?.forEach(item => item.classList.remove('active'));
    target.classList.add('active');
    
    if (window.innerWidth < 992) {
      this.closeMenu();
    }
  }

  addSideMenuItemClickListeners(): void {
    this.sideMenuItems?.forEach(item => {
      item.addEventListener('click', () => {
        this.sideMenuItems?.forEach(sideItem => sideItem.classList.remove('active'));
        item.classList.add('active');
        
        if (window.innerWidth < 992) {
          this.closeMenu();
        }
      });
    });
  }
}