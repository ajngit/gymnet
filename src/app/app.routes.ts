
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { SlotComponent } from '../components/slot/slot.component';
import { BookingComponent } from '../components/booking/booking.component';
import { RevenueComponent } from '../components/revenue/revenue.component';
import { UserComponent } from '../components/user/user.component';
import { UserdetailsComponent } from '../components/userdetails/userdetails.component';

export const routes: Routes = [
    {
        path:'', component:DashboardComponent
    },
    {
        path:'slot',component:SlotComponent //,canActivate: [AuthGuard]
      },
      {
        path:'booking',component:BookingComponent
      },
      {
        path:'revenue',component:RevenueComponent
      },
      {
        path:'user',component:UserComponent
      },
      {
        path:'userlist',component:UserdetailsComponent
      },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
  
