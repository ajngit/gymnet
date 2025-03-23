
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:'', component:DashboardComponent
    },
    // {
    //     path:'',component:HomeComponent //,canActivate: [AuthGuard]
    //   },
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
  
