
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { SlotComponent } from '../components/slot/slot.component';

export const routes: Routes = [
    {
        path:'', component:DashboardComponent
    },
    {
        path:'slot',component:SlotComponent //,canActivate: [AuthGuard]
      },
    //   {
    //     path:'billing',component:BillingComponent
    //   },
    //   {
    //     path:'addproduct',component:AddProductComponent
    //   },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
  
