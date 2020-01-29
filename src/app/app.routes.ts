import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { TransportComponent } from './components/transport/transport.component';
import { ProfileComponent } from './components/profile/profile.component';

const APP_ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'transport', component: TransportComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', component: HomeComponent },
];


export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
