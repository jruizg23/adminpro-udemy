import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    // this.regresaObservable().pipe(
    //    retry(2)
    //  )
    this.subscription = this.regresaObservable()
    .subscribe(
      numero => console.log('Subs', numero),
      err => console.error('Error en el obs$', err),
      () => console.log('El observador obs$ termino!!')
    );

    const miObservable$ = new Observable(this.otroObservable);
    miObservable$.subscribe(
      numero => console.log('Subs_1', numero),
      err => console.error('Error en miObservable$', err),
      () => console.log('El observador miObservable$ termino!!')
    );
  }

  // constructor() {

  //   const obs$ = new Observable(
  //     (observer) => {
  //       let contador = 0;
  //       const intervalo = setInterval(
  //         () => {
  //           contador++;
  //           observer.next( contador );

  //           if (contador === 3) {
  //             clearInterval(intervalo);
  //             observer.complete();
  //           }

  //           if (contador === 2) {
  //             // clearInterval(intervalo);
  //             observer.error('Auxilio!');
  //           }
  //         }, 1000);

  //     }
  //    );

  //   obs$.pipe(
  //      retry(2)
  //    )
  //   .subscribe(
  //     numero => console.log('Subs', numero),
  //     err => console.error('Error en el obs$', err),
  //     () => console.log('El observador termino!!')
  //   );
  // }

  ngOnInit() {
  }

  regresaObservable(): Observable<any> {
    return new Observable(
      (observer: Subscriber<any>) => {
        let contador = 0;
        const intervalo = setInterval(
          () => {
            contador++;
            const salida = {
              valor: contador
            };
            observer.next( salida );

            // if (contador === 3) {
            //   clearInterval(intervalo);
            //   observer.complete();
            // }

            // if (contador === 2) {
            //   // clearInterval(intervalo);
            //   observer.error('Auxilio!');
            // }
          }, 1000);

      }).pipe(
        map( (resp) => resp.valor ),
        filter( (valor, index) => {
          // console.log('Filter', valor, index);
          return ((valor % 2) === 1) ? true : false;
        } )
      );
  }

  otroObservable(observer: Subscriber<number>) {
    let contador = 0;
    const intervalo = setInterval(
          () => {
            contador++;
            observer.next( contador );

            if (contador === 3) {
              clearInterval(intervalo);
              observer.complete();
            }

            if (contador === 2) {
              // clearInterval(intervalo);
              observer.error('Auxilio!');
            }
          }, 1000);
    return { unsubscribe() {}};
  }

  ngOnDestroy() {
    console.log('La página se va a destruir!!!!!!!');
    this.subscription.unsubscribe();
  }

}
