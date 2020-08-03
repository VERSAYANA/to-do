import { Component } from '@angular/core'
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

interface Item {
  name: string
  uid: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tasksCollection: AngularFirestoreCollection<Task>
  tasks: Observable<Task[]>
  user: User

  constructor(
    public fireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.fireAuth.user.subscribe((user) => {
      this.user = user
      this.tasksCollection = this.firestore.collection('tasks', (ref) =>
        ref.where('owner', '==', this.user.uid)
      )
      this.tasks = this.tasksCollection.valueChanges()
    })
  }

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }

  createTask(text: string): void {
    this.tasksCollection.add({
      owner: this.user.uid,
      focus: false,
      text,
      complete: false
    })
  }
}
