import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { BracketsManagerComponent } from './components/brackets-manager/brackets-manager.component';

// Vendor
import { StageType } from 'brackets-model';

declare global {
  interface Window {
    bracketsViewer?: any | undefined;
  }

  interface Dataset {
    title: string;
    type: StageType;
    roster: { id: number; name: string }[];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    BracketsManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
