import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import {AppComponent} from './app.component'
import {HomeComponent} from './routes/home/home.component'

const routes: Routes = [
  { path: ':task', component: HomeComponent },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
