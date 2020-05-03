import { Observable, of, from, fromEvent, concat, interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { allBooks, allReaders } from './data';

//#region Creating Observables...


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

//#region Subscribing to Observables with observers

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
const timesDiv: any = document.getElementById('times');
const button: any = document.getElementById('timerButton');

// * interval returns an observable that produces a stream of integers at every specified time
// const timer$ = interval(1000);
const timer$ = new Observable((subscriber) => {
  let i = 0;
  const intervalID = setInterval(() => {
    subscriber.next(i++);
  }, 1000);

  return () => {
    console.log('Clean Up code running');
    clearInterval(intervalID);
  }
});

const timerSubscription = timer$.subscribe(
  (value) => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
  null,
  () => console.log('All done here!'),
);

// * chain subscriptions so that an unscubscribe click on one subscriber cancels both
const timerConsoleSubscription = timer$.subscribe(
  (value) => console.log(`${new Date().toLocaleTimeString()} (${value})`),
);

timerSubscription.add(timerConsoleSubscription);

// * remove an added subscription
// timerSubscription.remove(timerConsoleSubscription);

fromEvent(button, 'click').subscribe((event) => timerSubscription.unsubscribe());

// * when an observable is cancelled by unsubscribe, there would be no complete function to be called
//#endregion
