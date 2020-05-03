import { Observable, of, from, fromEvent, concat } from 'rxjs';
import { allBooks, allReaders } from './data';

// * an observable is not executed until an object subscribes to it

// * add $ sign to all variables that would store an observale
const allBooksObservable$ = Observable.create((subscriber: any) => {

  if (allBooks.length !== 6) {
    subscriber.error('Incorrect list');
  }

  for (const book of allBooks) {
    subscriber.next(book);
  }

  setTimeout(() => {
    subscriber.complete();
  }, 2000);

  return () => console.log('Executing cleanup');
});

// allBooksObservable$.subscribe((book: any) => console.log(book.title));

// * of - can pass in a bunch of values that we want the observable to produce
const source1$ = of('hello', 23, true, allReaders[0].name);

// source1$.subscribe((value) => console.log(value));

// * from - pass in a single object that already encapsulates a group of values

const source2$ = from(allBooks);

// source2$.subscribe((book) => console.log(book.title));

// * concat - used to combine observables
concat(source1$, source2$).subscribe((values) => console.log(values));

