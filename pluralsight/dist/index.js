import { Observable } from 'rxjs';
import { allBooks } from './data';
function subscribe(subscriber) {
    for (const book of allBooks) {
        subscriber.next(book);
    }
}
const allBooksObservable$ = new Observable(subscribe);
allBooksObservable$.subscribe((book) => console.log(book.title));
