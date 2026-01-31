import { Component, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared.service';

@Component({
    standalone: true,
    selector: 'app-message',
    imports: [CommonModule],
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageComponent {

    @ViewChild('chatArea') chatArea!: ElementRef;

    photos : string[] = [];
    currentPhoto = signal(0);
    showNext = signal(false);
    messages : string[] = [];

    visibleMessages = signal<string[]>([]);
    typingText = signal('');
    messageIndex = 0;
    charIndex = 0;

    masterData = this.sharedService.gift;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sharedService: SharedService,
    ) {
		effect(() => {
			const data = this.masterData();
			if (!data) return;

			this.messages = data.loveMessages;
			this.photos = data.tankLovePhotos;
            this.startSlider();
            setTimeout(() => {
                this.typeNextMessage();
            }, 5000)
		});
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        effect(() => {
            this.visibleMessages();

            queueMicrotask(() => {
                const el = this.chatArea?.nativeElement;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }     
            })
        })
    }

    startSlider() {
        setInterval(() => {
        this.currentPhoto.update(i => (i + 1) % this.photos.length);
        }, 2000);
    }

    typeNextMessage() {
        if (this.messageIndex >= this.messages.length) {
            this.showNext.set(true);
            return;
        }

        const text = this.messages[this.messageIndex];
        this.charIndex = 0;
        this.typingText.set('');

        const interval = setInterval(() => {
        this.typingText.update(t => t + text[this.charIndex]);
        this.charIndex++;

        if (this.charIndex >= text.length) {
            clearInterval(interval);

            setTimeout(() => {
            this.visibleMessages.update(v => [...v, text]);
            this.typingText.set('');
            this.messageIndex++;
            this.typeNextMessage();
            }, 1500);
        }
        }, 50);
    }

    next() {
        const giftId = this.route.snapshot.paramMap.get('giftId');
        this.router.navigate([giftId, 'countdown']);
    }
}
