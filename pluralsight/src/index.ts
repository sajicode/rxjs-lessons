import { Observable } from 'rxjs';
import { allBooks } from './data';

// * an observable is not executed until an object subscribes to it

// * add $ sign to all variables that would store an observale
const allBooksObservable$ = new Observable((subscriber) => {

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

allBooksObservable$.subscribe((book: any) => console.log(book.title));
