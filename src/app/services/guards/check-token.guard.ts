import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivateChild {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivateChild(): Promise<boolean> | boolean {

    const token = this.usuarioService.accessToken;

    const payload = JSON.parse( atob(token.split('.')[1]) );

    const expirado = this.tokenExpired(payload.exp);

    if (expirado) {
      // this.router.navigate(['/login']);
      this.usuarioService.logout();
      return false;
    }

    return this.checkRenew( payload.exp );
  }

  checkRenew( fechaExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      const tokenExp = new Date( fechaExp * 1000);
      const now = new Date();

      // Incremento la hora en 4
      now.setTime( now.getTime() + (1 * 60 * 60 * 1000) );

      if (tokenExp.getTime() > now.getTime()) {
        resolve(true);
      } else {

        this.usuarioService.renovarToken()
            .subscribe(
              () => resolve(true),
              () => {
                // this.router.navigate(['/login']);
                this.usuarioService.logout();
                reject(false);
              }
            );

      }

      resolve(true);
    });
  }

  tokenExpired( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;
    return ahora > fechaExp;
  }

}
