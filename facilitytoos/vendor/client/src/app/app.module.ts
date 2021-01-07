import { ArchiveService } from './services/archive.service';
import { ConfirmDialogService } from './shared/confirm-dialog.service';
import { ExportService } from './services/export.service';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificatiesComponent } from './notificaties/notificaties.component';
import { OverzichtComponent } from './overzicht/overzicht.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArchiefComponent } from './archief/archief.component';
import { AuthComponent } from './auth/auth.component';
import { CreateDefectComponent } from './create-defect/create-defect.component';
import { DefectMeldenComponent } from './defect-melden/defect-melden.component';
import { InstellingenComponent } from './instellingen/instellingen.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MijnMeldingenComponent } from './mijn-meldingen/mijn-meldingen.component';
import { MijnTakenComponent } from './mijn-taken/mijn-taken.component';
import { NoodgevalComponent } from './noodgeval/noodgeval.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableFilterModule } from 'mat-table-filter';
import {MatBadgeModule, MatDialogModule, MatExpansionModule} from '@angular/material'
import { MatButtonModule, MatInputModule, MatTableModule, MatPaginatorModule, MatGridListModule, MatCheckboxModule,
   MatCardModule, MatSelectModule, MatTabsModule, MatMenuModule, MatBottomSheetModule, MatAutocompleteModule   } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './auth-service/auth.service';
import { MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { CreateTaskComponent } from './create-task/create-task.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth-service/auth-guard';
import { TaskMeldenComponent } from './task-melden/task-melden.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { MeldingDetailComponent } from './melding-detail/melding-detail.component';
import { DialogModalComponent } from './Modal/dialog-modal/dialog-modal.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { CompressorService } from './services/Compressor.service';
import { NgpSortModule } from "ngp-sort-pipe"
import { CategoryService } from './services/category.service';
import { AdminGuard } from './auth-service/admin-guard';
import { MijnTakenGuard } from './auth-service/mijn-taken-guard';
import { CategoryComponent } from './category/category.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { MatContactsDiaglogComponent } from './mat-contacts-diaglog/mat-contacts-diaglog.component';
import { CreateExternalFirmDialogComponent } from './create-external-firm-dialog/create-external-firm-dialog.component';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { UpdateContactDialogComponent } from './update-contact-dialog/update-contact-dialog.component';
import { CategoryModalComponent } from './Modal/category-modal/category-modal.component';



export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/', ['user.read']]
];

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;


@NgModule({
  declarations: [
    AppComponent,
    ArchiefComponent,
    AuthComponent,
    CreateDefectComponent,
    DefectMeldenComponent,
    InstellingenComponent,
    NavBarComponent,
    MijnMeldingenComponent,
    MijnTakenComponent,
    NotificatiesComponent,
    NoodgevalComponent,
    NotFoundComponent,
    OverzichtComponent,
    CreateTaskComponent,
    TaskMeldenComponent,
    AdminViewComponent,
    MeldingDetailComponent,
    TaskMeldenComponent,
    DialogModalComponent,
    TaskDetailComponent,
    CategoryComponent,
    MatConfirmDialogComponent,
    MatContactsDiaglogComponent,
    CreateExternalFirmDialogComponent,
    CreateExternalFirmDialogComponent,
    UsersDialogComponent,
    UpdateContactDialogComponent,
    UsersDialogComponent,
    CategoryModalComponent

  ],
  imports: [
    MatAutocompleteModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatGridListModule,
    MatInputModule,
    MatTableFilterModule,
    MatTableModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    Ng2SearchPipeModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatBottomSheetModule,
    NgpSortModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MsalModule.forRoot({
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
    })
  ],
  providers: [AuthService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    AuthGuard,
    AdminGuard,
    MijnTakenGuard,
    CompressorService,
    ExportService,
    CategoryService,
    ConfirmDialogService,
    ArchiveService


  ],
  // tslint:disable-next-line: max-line-length
  entryComponents: [DialogModalComponent, MatConfirmDialogComponent, CategoryComponent, CreateExternalFirmDialogComponent , UsersDialogComponent, CategoryModalComponent, MatContactsDiaglogComponent, UpdateContactDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
