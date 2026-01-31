import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftService, GiftData } from '../../services/gift.service';

@Component({
	standalone: true,
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {

	gift = this.giftService.gift;
	giftId : any;

	hearts = Array.from({ length: 24 }).map(() => ({
		left: Math.random() * 100,
		delay: Math.random() * 6,
		size: 8 + Math.random() * 14,
		duration: 6 + Math.random() * 6
	}));

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private giftService: GiftService
	) {

	}

	ngOnInit(): void {
		this.giftId = this.route.snapshot.paramMap.get('giftId');
		if (!this.giftId) return;

		this.giftService.listenGift(this.giftId);
	}

	goNext() {
		this.router.navigate(['gift', this.giftId, 'tank']);
	}
}
