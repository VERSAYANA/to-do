import { Component, OnInit } from '@angular/core'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase/app'
import { Observable } from 'rxjs'
import { Task } from '../intefaces'
import { UserService } from '../services/user.service'
import { DataService } from '../services/data.service'
import { ActivatedRoute } from '@angular/router'

interface Item {
  name: string
  uid: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User
  taskId: string

  constructor(
    public fireAuth: AngularFireAuth,
  ) {
    this.fireAuth.user.subscribe((user) => {
      this.user = user
    })
  }

  ngOnInit(): void {}

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }
}
