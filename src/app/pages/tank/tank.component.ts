import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { SharedService } from '../../shared.service';

interface PhotoCard {
	id: number;
	x: number;
	y: number;
	rotation: number;
	image: string;
	type: 'real' | 'fake' | 'empty';
	revealed: boolean;
	removed: boolean;
}

@Component({
	selector: 'app-love-tank',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tank.component.html',
	styleUrls: ['./tank.component.css'],
})

export class TankComponent {
	cards = signal<PhotoCard[]>([]);
	progress = signal(0);
	maxProgress = 10;
	timeLeft = signal(100);
	timerId: any;
	hint = signal('Geser foto untuk menemukan cinta!');

	slideSound = new Audio('/assets/slide.mp3');
	popSound = new Audio('/assets/pop.mp3');
	failSound = new Audio('/assets/fail.mp3');

	boardEl!: HTMLElement;
	isDesktop = window.innerWidth >= 768;

	gameOver = signal(false);
	success = signal(false);

	showIntro = signal(true);

	masterData = this.sharedService.gift;
	giftId : any;
	photos: string[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private sharedService: SharedService,
	) {}

	ngOnInit() {
		this.giftId = this.route.snapshot.paramMap.get('giftId');
		const dataShared = this.masterData();
		this.generateCards();
	}

	ngAfterViewInit() {
		this.boardEl = document.querySelector('.board')!;
	}

	startGame() {
		this.showIntro.set(false);
		this.startTimer();
	}

	getRandomImage(): string {
		const gift = this.masterData();
		if (!gift || !gift.tankLovePhotos?.length) {
			return '';
		}

		const randomIndex = Math.floor(Math.random() * gift.tankLovePhotos.length);
		return gift.tankLovePhotos[randomIndex];
	}

	playSound(audio: HTMLAudioElement) {
		audio.currentTime = 0;
		audio.play().catch(() => {});
	}

 	generateCards() {
		const total = 30;
		const realHearts = 10;
		const fakeHearts = 5;
		const cardSize = 120;

		const types = [
		...Array(realHearts).fill('real'),
		...Array(fakeHearts).fill('fake'),
		...Array(total - realHearts - fakeHearts).fill('empty'),
		].sort(() => Math.random() - 0.5);

		const boardWidth = this.isDesktop
		? window.innerWidth * 0.75
		: window.innerWidth;

		const boardHeight = this.isDesktop
		? window.innerHeight
		: window.innerWidth * 2;

		this.cards.set(
			types.map((type, i) => {
					const x = Math.random() * (boardWidth - cardSize);
					const y = Math.random() * (boardHeight - cardSize);

					return {
						id: i,
						x,
						y,
						rotation: Math.random() * 20 - 10,
						image: this.getRandomImage(),
						type,
						revealed: false,
						removed: false,
					};
			})
		);
  	}

  	startDrag(card: PhotoCard, event: PointerEvent) {
		this.slideSound.play();

		const boardRect = this.boardEl.getBoundingClientRect();
		const cardSize = 120;

		const startX = event.clientX;
		const startY = event.clientY;
		const originX = card.x;
		const originY = card.y;

		const move = (e: PointerEvent) => {
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			let newX = originX + dx;
			let newY = originY + dy;

			newX = Math.max(0, Math.min(newX, boardRect.width - cardSize));
			newY = Math.max(0, Math.min(newY, boardRect.height - cardSize));

			this.cards.update(cards =>
				cards.map(c =>
				c.id === card.id
					? {
						...c,
						x: newX,
						y: newY,
						revealed: Math.abs(dx) > 60 || Math.abs(dy) > 60
					}
					: c
				)
			);
    	};

		const up = () => {
		window.removeEventListener('pointermove', move);
		window.removeEventListener('pointerup', up);
		};

		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
  	}


  	collect(card: PhotoCard) {
		if (card.type === 'real') {
			this.progress.update(p => Math.min(p + 1, this.maxProgress));
			this.hint.set('Cinta bertambah 💗');
			this.popSound.play();
		
			if (this.progress() >= this.maxProgress) {
				this.onSuccess();
			}
		}

		if (card.type === 'fake') {
			this.progress.update(p => Math.max(p - 1, 0));
			this.hint.set('Ups… cinta palsu 💔');
			this.failSound.play();
		}

		this.cards.update(cards =>
			cards.map(c => (c.id === card.id ? { ...c, revealed: false, removed: true } : c))
		);
  	}

  	startTimer() {
		if (this.timerId) {
			clearInterval(this.timerId);
		}

		this.timerId = setInterval(() => {
			const next = this.timeLeft() - 1;
			this.timeLeft.set(next);

			if (next <= 0) {
				this.timeLeft.set(0);
				clearInterval(this.timerId);
				this.timerId = null;
				this.onTimeUp();
			}
		}, 1000);
  	}

	onTimeUp() {
		if (this.progress() < this.maxProgress) {
			this.gameOver.set(true);
			this.success.set(false);
			this.failSound.play();
		}
	}

	onSuccess() {
		clearInterval(this.timerId);
		this.gameOver.set(true);
		this.success.set(true);
		this.launchConfetti();
	}

	launchConfetti() {
		confetti({
			particleCount: 150,
			spread: 70,
			origin: { y: 0.6 }
		});
	}

	retry() {
		this.progress.set(0);
		this.timeLeft.set(60);
		this.gameOver.set(false);
		this.success.set(false);
		this.generateCards();
		this.startTimer();
	}

	next() {
		const giftId = this.route.snapshot.paramMap.get('giftId');
		this.router.navigate([giftId, 'puzzle']);
	}
}
