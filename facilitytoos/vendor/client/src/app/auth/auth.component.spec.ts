// import { AuthComponent } from './auth.component';
// import { AuthService } from '../auth-service/auth.service';
// import { TestBed } from '@angular/core/testing';
// import { browser } from 'protractor';


// describe('test AuthComponent', () => {
//   let component: AuthComponent;
//   let authService: AuthService;
//   beforeEach(() => {
//     authService =  new AuthService(null);
//     component = new AuthComponent(null ,null,authService);
// });
// afterEach(() => {
//   authService= null;
//   component = null;
// });
//    it('isLoggedIn should return false if user is not logged in', ()=> {
// spyOn(authService,'Authenticated').and.returnValue(false);
//     expect(component.isLoggedIn()).toBeFalsy();
//   });

//   it('isLoggedIn should return true if user is  logged in', ()=> {

//     spyOn(authService,'Authenticated').and.returnValue(true);
//         expect(component.isLoggedIn()).toBeTruthy();
//       });

//   it('when click on login button it redirect to microsoft login page', ()=> {
//     spyOn(component,'login');
//         expect(component.login()).toHaveBeenCalled;
//       });
// });
