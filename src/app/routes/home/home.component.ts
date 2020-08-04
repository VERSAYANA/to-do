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
import { DataService } from '../../../services/data.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // lvl1: Observable<Task[]>
  topTasksRef: AngularFirestoreCollection<Task>
  bottomTasksRef: AngularFirestoreCollection<Task>
  selectedTaskRef: AngularFirestoreDocument<Task>
  topTasks: Observable<Task[]>
  bottomTasks: Observable<Task[]>
  selectedTask: Task
  // user: User
  taskId: string | null
  selectedTaskSync: Task | undefined

  tasksCollection: AngularFirestoreCollection<Task>
  tasksCollection2: AngularFirestoreCollection<Task>
  // private tasks: Observable<Task[]>
  // private user: User
  rootLevelTasks: Observable<Task[]>
  user: User
  lvl1: Observable<Task[]>
  lvl1Parent: string
  lvl2: Observable<Task[]>
  lvl2Parent: string
  lvl3: Observable<Task[]>
  lvl3Parent: string
  selected: Task

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.fireAuth.user.subscribe((user) => {
      this.user = user
      // this.lvl1 = this.dataService.start(user)
      this.tasksCollection = this.db.collection('tasks', (ref) =>
        ref.where('owner', '==', user.uid).where('parent', '==', null)
      )
      this.rootLevelTasks = this.tasksCollection.valueChanges()
      this.lvl1 = this.rootLevelTasks
      this.lvl1.subscribe((res) => {
        this.lvl1Parent = null
      })
    })
    // this.route.params.subscribe((params) => {
    //   console.log(params)
    //   this.taskId = params['task']
    //   this.fireAuth.user.subscribe((user) => {
    //     this.user = user
    //
    //     if (this.selectedTask === undefined) {
    //
    //     } else {
    //       this.selectedTaskRef = this.firestore
    //         .collection('tasks', (ref) =>
    //           ref.where('owner', '==', this.user.uid)
    //         )
    //         .doc(this.taskId)
    //       this.selectedTask = this.selectedTaskRef.valueChanges()
    //
    //       this.selectedTask.subscribe((task) => {
    //         this.selectedTaskSync = task
    //         this.topTasksRef = this.firestore.collection('tasks', (ref) =>
    //           ref
    //             .where('owner', '==', this.user.uid)
    //             .where('parent', '==', task.parent)
    //         )
    //         this.topTasks = this.topTasksRef.valueChanges()
    //         this.bottomTasksRef = this.firestore.collection('tasks', (ref) =>
    //           ref
    //             .where('owner', '==', this.user.uid)
    //             .where('parent', '==', task.uid)
    //         )
    //         this.bottomTasks = this.bottomTasksRef.valueChanges()
    //       })
    //     }
    //   })
    // })
    // console.log(this.taskId)
  }

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }

  selectTask(task: Task, level: number): void {
    this.selectedTask = task
    const tasks = this.db
      .collection('tasks', (ref) =>
        ref.where('owner', '==', this.user.uid).where('parent', '==', task.uid)
      )
      .valueChanges()
    switch (level) {
      case 1:
        // @ts-ignore
        this.lvl2 = tasks
        this.lvl2.subscribe((res) => {
          this.lvl2Parent = res[0].uid
        })
        break
      case 2:
        // @ts-ignore
        this.lvl3 = tasks
        this.lvl3.subscribe((res) => {
          this.lvl3Parent = res[0].uid
        })
        break
    }
  }

  createTask(text: string, parent: string | null): void {
    console.log(text)
    console.log(parent)
    const id = this.db.createId()
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
