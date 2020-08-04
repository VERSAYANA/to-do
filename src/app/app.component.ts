import {Component, OnInit} from '@angular/core'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import {AngularFireAuth} from '@angular/fire/auth'
import {auth, User} from 'firebase/app'
import {Observable} from 'rxjs'
import {Task} from '../intefaces'
import {UserService} from '../services/user.service'
import {DataService} from '../services/data.service'
import {ActivatedRoute} from '@angular/router'

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
  userTasksCollection: AngularFirestoreCollection<Task>
  tasks: Observable<Task[]>
  user: User
  taskId: string

  constructor(
    public fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
  ) {

    this.fireAuth.user.subscribe((user) => {
      this.user = user
      this.userTasksCollection = this.firestore.collection('tasks', (ref) =>
        ref.where('owner', '==', this.user.uid).where('parent', '==', null)
      )
      this.tasks = this.userTasksCollection.valueChanges()
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskId = params.task
      console.log(this.taskId)
    })
  }

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }

  createTask(text: string, parent: string | null): void {
    const id = this.firestore.createId()
    this.userTasksCollection.add({
      owner: this.user.uid,
      focus: false,
      text,
      complete: false,
      parent,
      uid: id,
    })
  }
}
