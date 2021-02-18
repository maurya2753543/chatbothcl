import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTopComponent } from './header-top/header-top.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatSnackBarModule} from '@angular/material';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SelectDropDownModule } from 'ngx-select-dropdown';

import { AppLoaderComponent } from './services/app-loader/app-loader.component';
import { AppLoaderService } from './services/app-loader/app-loader.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
    SelectDropDownModule
  ],
  declarations: [HeaderTopComponent, BulkUploadComponent, AppLoaderComponent],
  exports: [HeaderTopComponent, BulkUploadComponent, AppLoaderComponent],
  entryComponents: [AppLoaderComponent],
  providers: [AppLoaderService]
})
export class SharedModule { }
