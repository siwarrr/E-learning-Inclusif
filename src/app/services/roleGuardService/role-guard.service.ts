import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getUserRole(); // Supposant que vous avez une méthode getUserRole dans votre service d'authentification
    
    console.log('Expected Role:', expectedRole); // Ajouter cette ligne pour afficher le rôle attendu
    console.log('User Role:', userRole); // Ajouter cette ligne pour afficher le rôle de l'utilisateur après la connexion
    
    if (userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/welcome']); // Redirigez vers une page d'erreur ou une autre page appropriée si l'utilisateur n'a pas le rôle attendu
      return false;
    }
  }
}