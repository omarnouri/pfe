import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ANALYZE_ROUTE } from './analyze.route';
import { AnalyzeComponent } from './analyze.component';
import { LoginModule } from 'app/login/login.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([ANALYZE_ROUTE]), LoginModule],
  declarations: [AnalyzeComponent],
})
export class AnalyzeModule {}
