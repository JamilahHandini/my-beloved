import { Component, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';

@Component({
	standalone: true,
	selector: 'app-countdown',
	imports: [CommonModule],
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.css'],
})

export class CountdownComponent implements OnInit {

	targetLabel = signal<'Birthday' | 'Anniversary' | 'Valentine' | 'Special Day'>('Birthday');
	targetDate = new Date();

	isWithInvitation : boolean = false;

	invitation : any = {};

	timeLeft = signal({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

 	prevSeconds = signal<number | null>(null);

	masterData = this.sharedService.gift;
	data : any;

	constructor(
		private sharedService : SharedService
	){
		effect(() => {
			this.data = this.masterData();
			if (!this.data) return;
			this.isWithInvitation = this.data.isWithInvitation;
			this.invitation = {
				...this.data.invitation,
				date: new Date(this.data.invitation?.date),
			};
			console.log('inv',this.invitation);
    	});
	}

	ngOnInit() {
		this.calculateTime();
		setInterval(() => 
			this.calculateTime(), 1000);
	}


  	calculateTime() {
		this.targetDate = new Date(this.data?.countDownDate);

		const now = new Date().getTime();

		const diff = this.targetDate.getTime() - now;

		if (diff <= 0) return;

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((diff / (1000 * 60)) % 60);
		const seconds = Math.floor((diff / 1000) % 60);

		this.prevSeconds.set(this.timeLeft().seconds);

		this.timeLeft.set({ days, hours, minutes, seconds });
  	}

	isFlipping = computed(() => {
		return this.prevSeconds() !== null &&
			this.prevSeconds() !== this.timeLeft().seconds;
	});
}
