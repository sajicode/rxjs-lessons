import { Observable, of, from, fromEvent, concat, interval, throwError, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, flatMap, filter, tap, catchError, take, takeUntil, multicast, refCount, publish, share, publishBehavior, publishLast, publishReplay } from 'rxjs/operators';
import { allBooks, allReaders } from './data';

//#region // * Creating Observables...


// * an observable is not executed until an object subscribes to it

// * add $ sign to all variables that would store an observale
// const allBooksObservable$ = Observable.create((subscriber: any) => {

//   if (allBooks.length !== 6) {
//     subscriber.error('Incorrect list');
//   }

//   for (const book of allBooks) {
//     subscriber.next(book);
//   }

//   setTimeout(() => {
//     subscriber.complete();
//   }, 2000);

//   return () => console.log('Executing cleanup');
// });

// allBooksObservable$.subscribe((book: any) => console.log(book.title));

// * of - can pass in a bunch of values that we want the observable to produce
// const source1$ = of('hello', 23, true, allReaders[0].name);

// source1$.subscribe((value) => console.log(value));

// * from - pass in a single object that already encapsulates a group of values

// const source2$ = from(allBooks);

// source2$.subscribe((book) => console.log(book.title));

// * concat - used to combine observables
// concat(source1$, source2$).subscribe((values) => console.log(values));

// * fromEvent - observable to handle events
// const button: any = document.getElementById('readersButton');

// fromEvent(button, 'click').subscribe((event) => {
//   console.log(event);

//   const readersDiv: any = document.getElementById('readers');

//   for (const reader of allReaders) {
//     readersDiv.innerHTML += reader.name + '<br>';
//   }
// });

// * making ajax requests with rxjs
// const button: any = document.getElementById('readersButton');

// fromEvent(button, 'click').subscribe((event) => {
//   ajax('https://api.github.com/users').subscribe((ajaxResponse) => {
//     console.log(ajaxResponse);

//     const users = ajaxResponse.response;
//     const readersDiv: any = document.getElementById('readers');

//     for (const user of users) {
//       readersDiv.innerHTML += user.login + '<br>';
//     }
//   });
// });
//#endregion

//#region // * Subscribing to Observables with observers

// const books$ = from(allBooks);

// * all functions - next, error, complete - are optional

// * using object literal
// const booksObserver = {
//   next: (book: any) => console.log(`Title: ${book.title}`),
//   error: (err: Error) => console.log(`Error: ${err}`),
//   complete: () => console.log('All Done!'),
// };

// books$.subscribe(booksObserver);

// * using callback function
// books$.subscribe(
//   (book: any) => console.log(`Title: ${book.title}`),
//   (err: Error) => console.log(`Error: ${err}`),
//   () => console.log('All Done!'),
// );

// * multiple observers
// * there can be multiple observers to an observable and
// * each call to subscribe triggers an independent execution for a particular observer

// const currentTime$ = new Observable((subscriber) => {
//   const timeString = new Date().toLocaleTimeString();
//   subscriber.next(timeString);
//   subscriber.complete();
// });

// currentTime$.subscribe((currentTime) => console.log(`Observer 1: ${currentTime}`));

// setTimeout(() => {
//   currentTime$.subscribe((currentTime) => console.log(`Observer 2: ${currentTime}`));
// }, 1000);

// setTimeout(() => {
//   currentTime$.subscribe((currentTime) => console.log(`Observer 3: ${currentTime}`));
// }, 2000);

// * cancelling observable execution
// const timesDiv: any = document.getElementById('times');
// const button: any = document.getElementById('timerButton');

// * interval returns an observable that produces a stream of integers at every specified time
// const timer$ = interval(1000);
// const timer$ = new Observable((subscriber) => {
//   let i = 0;
//   const intervalID = setInterval(() => {
//     subscriber.next(i++);
//   }, 1000);

//   return () => {
//     console.log('Clean Up code running');
//     clearInterval(intervalID);
//   }
// });

// const timerSubscription = timer$.subscribe(
//   (value) => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
//   null,
//   () => console.log('All done here!'),
// );

// // * chain subscriptions so that an unscubscribe click on one subscriber cancels both
// const timerConsoleSubscription = timer$.subscribe(
//   (value) => console.log(`${new Date().toLocaleTimeString()} (${value})`),
// );

// timerSubscription.add(timerConsoleSubscription);

// * remove an added subscription
// timerSubscription.remove(timerConsoleSubscription);

// fromEvent(button, 'click').subscribe((event) => timerSubscription.unsubscribe());

// * when an observable is cancelled by unsubscribe, there would be no complete function to be called
//#endregion

//#region // * Using Operators

// * merge map operator maps one value to another & then flattens the result
// ajax('https://api.github.com/users')
// .pipe(
// mergeMap((ajaxResponse) => ajaxResponse.response),
// * each item in response is logged individually
// filter((user: any) => user.id < 20),
// * return users with id less than 20
// tap((oldUser: any) => console.log(`Username: ${oldUser.login}`)),
// * pick specific items off the returned observable
// catchError((err) => of({ id: 73, login: 'saji-tron' })),
// * catch errors that might have been thrown by any of the observables returned from the operators above
// * let the subscriber handle the error as a normal observable value
// catchError((err, caught) => caught),
// * retry same code again
// catchError((err) => {
//   throw new Error(`Something bad happened ${err.message}`);
// }),
// * send error to error handler in subscriber
// catchError((err) => throwError(err.message)),
// * send error to error handler with rxjs throw error. it ensures the error is wrapped in an observable
// )
// .subscribe(
//   (finalValue) => console.log(`VALUE: ${finalValue.login}`),
//   (error: Error) => console.log(`ERROR: ${error}`),
// );

// * Controlling the number of values produces
// const timesDiv: any = document.getElementById('times');
// const button: any = document.getElementById('timerButton');

// const timer$ = new Observable((subscriber) => {
//   let i = 0;
//   const intervalID = setInterval(() => {
//     subscriber.next(i++);
//   }, 1000);

//   return () => {
//     console.log('Clean Up code running');
//     clearInterval(intervalID);
//   }
// });

// const cancelTimer$ = fromEvent(button, 'click');

// timer$
//   .pipe(
//     // take(5),
//     // * returns only a specified number of values
//     takeUntil(cancelTimer$),
//     // * returns values until the cancelTimer event is triggered
//   )
//   .subscribe(
//     (value) => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
//     null,
//     () => console.log('All done here!'),
//   );

//#endregion

//#region // * Creating our own operator

// * mergeMap == flatMap

// function grabAndLogUsersLogin(id: number, log: boolean) {
//   return (source$: any) => {
//     return new Observable((subscriber) => {
//       // * returning the subscription allows us to unsubscribe
//       return source$.subscribe(
//         (user: any) => {
//           if (user.id < id) {
//             subscriber.next(user);
//             if (log) {
//               console.log(`OG User: ${user.login}`);
//             }
//           }
//         },
//         (err: Error) => subscriber.error(err),
//         () => subscriber.complete(),
//       );
//     });
//   };
// }

// function grabOGUsers(id: number) {
//   return filter((user: any) => user.id < id);
// }

// function grabAndLogOGUsersWithPipe(id: number, log: boolean) {
//   return (source$: any) => source$.pipe(
//     filter((user: any) => user.id < id),
//     tap((oGUser: any) => log ? console.log(`Username: ${oGUser.login}`) : null),
//   );
// }

// ajax('https://api.github.com/users')
//   .pipe(
//     flatMap((ajaxResponse) => ajaxResponse.response),
//     // filter((user: any) => user.id < 20),
//     // tap((oldUser: any) => console.log(`Username: ${oldUser.login}`)),
//     // grabAndLogUsersLogin(7, false),
//     // grabOGUsers(5),
//     grabAndLogOGUsersWithPipe(5, false),
//   )
//   .subscribe(
//     (finalValue: any) => console.log(`VALUE: ${finalValue.login}`),
//     (error: Error) => console.log(`ERROR: ${error}`),
//   );

//#endregion

//#region  // * Using Subjects & Multicasted Observables

// const subject$ = new Subject();

// subject$.subscribe(
// (value) => console.log(`Observer 1: ${value}`),
// );

// subject$.subscribe(
// (value) => console.log(`Observer 2: ${value}`),
// );

// * subjects produce values when theor next method is called
// * method 1
// subject$.next('Hello');

// * method 2
// const source$ = new Observable((subscriber) => {
// subscriber.next('Greetings Earthlings!');
// });

// * we can perform the action below since a subject is an observer
// source$.subscribe(subject$);

// * Using a Subject to convert an observable from cold to hot
// * this basically means that there would be no new execution for every subscription to an observer
// * if a subscriber is late to the party, he picks up where the party is
// * this way, each observer receives a value at the same time
const source$: any = interval(1000).pipe(
  take(4),
  // multicast(new Subject()),
  // publish(),
  // * publish is like a wrapper around multicast
  // publishLast(),
  // * returns the last value
  // publishBehavior(33),
  // * acts like a seed value when no value has been returned from the source observable
  publishReplay(),
  // * stores values and replays them for observers
  refCount(),
  // * starts executing as soon as there is at least one observer
  // share(),
  // * allows late subscribers to a multicast trigger a new exectuion
);

// const subject$ = new Subject();
// source$.subscribe(subject$);

// source$.subscribe(
//   (value: any) => console.log(`Observer 1: ${value}`),
// );

// setTimeout(() => {
//   source$.subscribe(
//     (value: any) => console.log(`Observer 2: ${value}`),
//   );
// }, 1000);

// setTimeout(() => {
//   source$.subscribe(
//     (value: any) => console.log(`Observer 3: ${value}`),
//   );
// }, 2000);

// setTimeout(() => {
//   source$.subscribe(
//     (value: any) => console.log(`Observer 4: ${value}`),
//     null,
//     () => console.log('Observer 4 complete'),
//   );
// }, 4500);

// * source$ does not start executing until connect is called,
// * except we add refCount/ share in the pipe function
// source$.connect();

//#endregion
