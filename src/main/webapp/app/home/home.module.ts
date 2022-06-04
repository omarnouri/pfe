import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { LoginModule } from 'app/login/login.module';
import { ArticleComponent } from './article/article.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), LoginModule],
  declarations: [HomeComponent, ArticleComponent],
})
export class HomeModule {}
