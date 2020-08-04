import { Component, OnInit } from '@angular/core'
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore'
import { Task } from '../../../intefaces'
import { Observable } from 'rxjs'
import { auth, User } from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  topTasksRef: AngularFirestoreCollection<Task>
  bottomTasksRef: AngularFirestoreCollection<Task>
  selectedTaskRef: AngularFirestoreDocument<Task>
  topTasks: Observable<Task[]>
  bottomTasks: Observable<Task[]>
  selectedTask: Observable<Task>
  user: User
  taskId: string | null
  selectedTaskSync: Task | undefined

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params)
      this.taskId = params['task']
      this.fireAuth.user.subscribe((user) => {
        this.user = user

        if (this.selectedTask === undefined) {
          
        } else {
          this.selectedTaskRef = this.firestore
            .collection('tasks', (ref) =>
              ref.where('owner', '==', this.user.uid)
            )
            .doc(this.taskId)
          this.selectedTask = this.selectedTaskRef.valueChanges()

          this.selectedTask.subscribe((task) => {
            this.selectedTaskSync = task
            this.topTasksRef = this.firestore.collection('tasks', (ref) =>
              ref
                .where('owner', '==', this.user.uid)
                .where('parent', '==', task.parent)
            )
            this.topTasks = this.topTasksRef.valueChanges()
            this.bottomTasksRef = this.firestore.collection('tasks', (ref) =>
              ref
                .where('owner', '==', this.user.uid)
                .where('parent', '==', task.uid)
            )
            this.bottomTasks = this.bottomTasksRef.valueChanges()
          })
        }
      })
    })
    // console.log(this.taskId)
  }

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }

  createTask(text: string, parent: string | null): void {
    console.log(text)
    console.log(parent)
    const id = this.firestore.createId()
    this.topTasksRef.doc(id).set({
      owner: this.user.uid,
      focus: false,
      text,
      complete: false,
      parent,
      uid: id,
    })
  }
}
