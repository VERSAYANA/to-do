import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase/app'
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore'
import { Task } from '../intefaces'
import { Observable } from 'rxjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // lvl1: Observable<Task[]>
  topTasksRef: AngularFirestoreCollection<Task>
  bottomTasksRef: AngularFirestoreCollection<Task>
  selectedTaskRef: AngularFirestoreDocument<Task>
  topTasks: Observable<Task[]>
  bottomTasks: Observable<Task[]>
  selectedTask: Task = null
  // user: User
  taskId: string | null
  selectedTaskSync: Task | undefined

  tasksCollection: AngularFirestoreCollection<Task>
  tasksCollection2: AngularFirestoreCollection<Task>
  // private tasks: Observable<Task[]>
  // private user: User
  rootLevelTasks: Observable<Task[]>
  user: User
  tasks: Task[]
  lvl1: Task[]
  lvl1Selected: Task
  lvl1Parent: string
  lvl2: Task[]
  lvl2Selected: Task
  lvl2Parent: string
  lvl3: Task[]
  lvl3Selected: Task
  lvl3Parent: string
  selected: Task | null = null
  showLvls = [true, false, false]
  focused = false
  focusedTask: Task

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.fireAuth.user.subscribe((user) => {
      this.user = user
      // this.lvl1 = this.dataService.start(user)
      this.tasksCollection = this.db.collection('tasks', (ref) =>
        ref.where('owner', '==', user.uid).orderBy('created')
      )
      this.rootLevelTasks = this.tasksCollection.valueChanges()
      this.rootLevelTasks.subscribe((tasks) => {
        this.tasks = tasks
        const focusedTask = this.tasks.findIndex((t) => t.focus === true)
        if (focusedTask !== -1) {
          this.focusedTask = this.tasks[focusedTask]
          this.focused = true
        } else {
          this.focusedTask = undefined
          this.focused = false
        }
        if (this.selectedTask === null) {
          this.lvl1 = tasks.filter((t) => t.parent === null)
          this.lvl2 = undefined
          this.lvl3 = undefined
          this.showLvls = [true, false, false]
          this.lvl1Parent = this.lvl1[0]?.parent || null
        } else if (this.selectedTask.parent === null) {
          this.lvl1 = tasks.filter((t) => t.parent === null)
          this.lvl2 = tasks.filter((t) => t.parent === this.selectedTask.uid)
          this.lvl3 = undefined
          this.lvl1Parent = this.lvl1[0]?.parent || null
          this.lvl2Parent = this.lvl1Selected?.uid || null
          this.showLvls = [true, true, false]
        } else {
          // this.lvl1 = tasks.filter((t) => t.parent === this.selectedTask.parent)
          // this.lvl3 = tasks.filter((t) => t.parent === this.selectedTask.uid)
          let oneLevelOneTaskParent
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].uid === this.selectedTask.parent) {
              oneLevelOneTaskParent = tasks[i].parent
            }
          }
          this.lvl1 = tasks.filter((t) => t.parent === oneLevelOneTaskParent)
          this.lvl2 = tasks.filter((t) => t.parent === this.selectedTask.parent)
          this.lvl3 = tasks.filter((t) => t.parent === this.selectedTask.uid)
          this.showLvls = [true, true, true]
          this.lvl1Parent = this.lvl1[0]?.parent || null
          this.lvl2Parent = this.lvl1Selected?.uid || null
          this.lvl3Parent = this.lvl2Selected?.uid || null
        }
        console.log('lvl1: ', this.lvl1)
        console.log('lvl2: ', this.lvl2)
        console.log('lvl3: ', this.lvl3)
      })
    })
  }

  login(): void {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.fireAuth.signOut()
  }

  selectTask(selectedTask: Task, level: number): void {
    switch (level) {
      case 1:
        this.lvl1Selected = selectedTask
        this.lvl2Selected = undefined
        this.lvl3Selected = undefined
        break
      case 2:
        this.lvl2Selected = selectedTask
        this.lvl3Selected = undefined
        break
      case 3:
        this.lvl1Selected = this.lvl2Selected
        this.lvl2Selected = selectedTask
        break
      default:
        break
    }
    this.selectedTask = selectedTask
    const tasks = this.tasks
    if (this.selectedTask === null) {
      this.lvl1 = tasks.filter((t) => t.parent === null)
      this.lvl2 = undefined
      this.lvl3 = undefined
      this.showLvls = [true, false, false]
      this.lvl1Parent = this.lvl1[0].parent
    } else if (this.selectedTask.parent === null) {
      this.lvl1 = tasks.filter((t) => t.parent === null)
      console.log(this.selectedTask.uid)
      this.lvl2 = tasks.filter((t) => t.parent === this.selectedTask.uid)
      this.lvl3 = undefined
      this.lvl1Parent = this.lvl1[0]?.parent || null
      this.lvl2Parent = this.lvl1Selected?.uid || null
      this.showLvls = [true, true, false]
    } else {
      // this.lvl1 = tasks.filter((t) => t.parent === this.selectedTask.parent)
      // this.lvl3 = tasks.filter((t) => t.parent === this.selectedTask.uid)
      let oneLevelOneTaskParent
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].uid === this.selectedTask.parent) {
          oneLevelOneTaskParent = tasks[i].parent
        }
      }
      this.lvl1 = tasks.filter((t) => t.parent === oneLevelOneTaskParent)
      this.lvl2 = tasks.filter((t) => t.parent === this.selectedTask.parent)
      this.lvl3 = tasks.filter((t) => t.parent === this.selectedTask.uid)
      this.showLvls = [true, true, true]
      this.lvl1Parent = this.lvl1[0]?.parent || null
      this.lvl2Parent = this.lvl1Selected?.uid || null
      this.lvl3Parent = this.lvl2Selected?.uid || null
    }
    console.log('lvl1: ', this.lvl1)
    console.log('lvl2: ', this.lvl2)
    console.log('lvl3: ', this.lvl3)
  }

  createTask(text: string, parent: string | null): void {
    console.log(text)
    console.log(parent)
    const id = this.db.createId()
    this.tasksCollection.doc(id).set({
      owner: this.user.uid,
      focus: false,
      text,
      complete: false,
      parent,
      uid: id,
      created: new Date(),
    })
  }

  delete(task: Task): void {
    if (task.focus) {
      this.focused = false
    }
    this.tasksCollection.doc(task.uid).delete()
  }

  complete(task: Task): void {
    if (task.focus) {
      this.focused = false
    }
    this.tasksCollection.doc(task.uid).update({
      complete: !task.complete,
    })
  }

  focus(task: Task): void {
    this.tasksCollection.doc(task.uid).update({
      focus: !task.focus,
    })
    // if (task.focus === false) {
    //   this.tasksCollection.doc(task.uid).update({
    //     focus: true,
    //   })
    //   this.focused = true
    // } else {
    //   this.tasksCollection.doc(task.uid).update({
    //     focus: false,
    //   })
    //   this.focusedTask = undefined
    //   this.focused = false
    // }
  }
}
