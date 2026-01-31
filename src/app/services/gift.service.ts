import { Injectable, signal } from '@angular/core';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SharedService } from '../shared.service';

export interface GiftData {
	fromName: string;
	toName: string;
	countDownDate: string;
	isWithInvitation: boolean;
	invitation: Invitation;
	polaroidGift: PolaroidGift[];
	tankLovePhotos: string[];
	photoPuzzle: string;
	loveMessages: string[];
}

export interface Invitation {
	title: string;
	place: string;
	date: string;
	dressCode: string;
}

export interface PolaroidGift {
	id: string;
	polaroidImage: string;
	giftImage: Date;
	selected: boolean;
}

@Injectable({ providedIn: 'root' })
export class GiftService {
	gift = signal<GiftData | null>(null);

	constructor(private shared: SharedService) {}

	listenGift(id: string) {
		const ref = doc(db, 'gifts', id);

		return onSnapshot(ref, snap => {
			if (snap.exists()) {
				this.gift.set(snap.data() as GiftData);
				this.shared.setGift(snap.data() as GiftData)
			}
		});
	}
}

