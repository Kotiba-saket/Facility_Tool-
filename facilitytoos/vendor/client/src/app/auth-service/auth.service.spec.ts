import { TestBed, async } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MsalService, MsalModule, MsalInterceptor, MsalGuard } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
   let authService: AuthService;
    const protectedResourceMap: [string, string[]][] = [
    ['https://graph.microsoft.com/v1.0/', ['user.read']]
  ];

  const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
   beforeEach(() => {
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule,RouterTestingModule,  MsalModule.forRoot({
    auth: {
      clientId: '9f13fe71-4882-4696-800b-b1effd4d1c52',
      authority: "https://login.microsoftonline.com/e967e4e9-7e1f-488e-b734-058232cc3b02/",
      validateAuthority: true,
      // redirectUri: "http://localhost:4200/",
      // postLogoutRedirectUri: "http://localhost:4200/",
      redirectUri: environment.redirectUrl ,
      postLogoutRedirectUri: environment.redirectUrl,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  },
  {
    popUp: !isIE,
    consentScopes: [
      "user.read",
      "openid",
      "profile",
      "api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user"
    ],
    unprotectedResources: ["https://www.microsoft.com/en-us/"],
    protectedResourceMap,
    extraQueryParameters: {}
  })],
  providers: [AuthService,{
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },
],
});
authService = TestBed.get(AuthService);
  });

   it('should get User information from azure ', () => {
  const dummyRes = {
    businessPhones: [],
    displayName: 'test',
    givenName: 'M',
  };
  authService.getUserInfo().subscribe( groups => {
    expect(groups).toEqual(dummyRes);
  });
});

   it('should list of members of specified group ', () => {
  const dummyGroupId = 'dummyGroupId'
  const dummyRes = {
    memberOfGroups: 'test group'
  };
  authService.getMembersOfGroup(dummyGroupId).subscribe( groups => {
    expect(groups).toEqual(dummyRes);
  });
});

   it('should get list of all exist groups ', () => {
  const dummyRes = {
    dummyListOfGroups: 'dummy list of groups'
  };
  authService.getGroupsList().subscribe( groups => {
    expect(groups).toEqual(dummyRes);
  });
});

   it('should remove user from group ', () => {
  const dummyUserId = 'userId';
  const dummyGroupId = 'groupId';
  authService.removeUserFromGroup(dummyUserId , dummyGroupId).subscribe( groups => {
    expect(groups).toBeNull();
  });
});

   it('should add user to group ', () => {
  const dummyUserId = 'userId';
  const dummyGroupId = 'groupId';
  authService.addMemberToGroup(dummyUserId , dummyGroupId).subscribe( groups => {
    expect(groups).toBeNull();
  });
});

   it('should get list of all users ', () => {
  const dummyRes = {
    usersList: 'dummy user'
  };
  authService.getUsersList().subscribe( groups => {
    expect(groups).toEqual(dummyRes);
  });
});

});
