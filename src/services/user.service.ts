import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private readonly user: Observable<User | null>
  //
  // constructor(public fireAuth: AngularFireAuth) {
  //   this.user = fireAuth.user
  // }
  //
  // login(): void {
  //   this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  // }
  //
  // logout(): void {
  //   this.fireAuth.signOut()
  // }
  //
  // getUser(): Observable<User | null> {
  //   return this.user
  // }
}
