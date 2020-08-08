import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'

import {environment} from '../environments/environment'
import {AngularFireModule} from '@angular/fire'
import {AngularFirestoreModule} from '@angular/fire/firestore'

import {AppComponent} from './app.component'
import {HomeComponent} from './routes/home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
