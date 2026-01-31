import { Injectable, signal } from '@angular/core';
import { GiftData } from './services/gift.service';

@Injectable({ providedIn: 'root' })
export class SharedService {

    private _gift = signal<GiftData | null>(this.loadFromStorage());
    gift = this._gift.asReadonly();

    setGift(data: GiftData) {
        this._gift.set(data);
        localStorage.setItem('gift-data', JSON.stringify(data));
    }

    clearGift() {
        this._gift.set(null);
        localStorage.removeItem('gift-data');
    }

    private loadFromStorage(): GiftData | null {
        const raw = localStorage.getItem('gift-data');
        return raw ? JSON.parse(raw) : null;
    }
}
