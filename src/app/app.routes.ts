import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
	{
		path: ':giftId',
		component: LandingComponent
	},
	{
		path: ':giftId/tank',
		loadComponent: () =>
			import('./pages/tank/tank.component')
			.then(m => m.TankComponent)
	},
	{
		path: ':giftId/message',
		loadComponent: () =>
			import('./pages/message/message.component')
			.then(m => m.MessageComponent)
	},
	{
		path: ':giftId/countdown',
		loadComponent: () =>
			import('./pages/countdown/countdown.component')
			.then(m => m.CountdownComponent)
	},
	{
		path: ':giftId/puzzle',
		loadComponent: () =>
			import('./pages/puzzle-gift/puzzle-gift.component')
				.then(m => m.PuzzleGiftComponent)
	},
	{
		path: '**',
		component: LandingComponent
	}
];
