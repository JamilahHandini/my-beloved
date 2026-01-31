import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared.service';

interface PuzzlePiece {
	id: number;
	correctIndex: number;
	currentIndex: number;
	backgroundPosition: string;
}

interface GiftOption {
	id: number;
	polaroidImage: string;
	giftImage: string;
	selected: boolean;
	hidden?: boolean;
}

@Component({
	selector: 'app-puzzle-gift',
	standalone: true,
	imports: [CommonModule, DragDropModule],
	templateUrl: './puzzle-gift.component.html',
	styleUrls: ['./puzzle-gift.component.css']
})

export class PuzzleGiftComponent implements OnInit {

	pieces: PuzzlePiece[] = [];
	imageUrl : any;
	solved = false;

	showGiftChooser = false;
	showFinalGift = false;
	selectedGift?: any;

	masterData = this.sharedService.gift;

  	giftOptions: any[]  = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private sharedService: SharedService
	) {
		effect(() => {
			const data = this.masterData();
			if (!data) return;

			this.imageUrl = data.photoPuzzle;
			this.giftOptions = [...data.polaroidGift];

			this.initPuzzle();
			this.shuffleGifts();

		});
	}


  ngOnInit() {
  }

  initPuzzle() {
		const temp: PuzzlePiece[] = [];
		const gridSize = 3;

		temp.push({
			id: 0,
			correctIndex: 0,
			currentIndex: 0,
			backgroundPosition: `0% 0%`
		});

		temp.push({
			id: 1,
			correctIndex: 1,
			currentIndex: 1,
			backgroundPosition: `-100% 0%`
		});

		temp.push({
			id: 2,
			correctIndex: 2,
			currentIndex: 2,
			backgroundPosition: `-50% 0%`
		});
		
		temp.push({
			id: 3,
			correctIndex: 3,
			currentIndex: 3,
			backgroundPosition: `0% -100%`
		});

		temp.push({
			id: 4,
			correctIndex: 4,
			currentIndex: 4,
			backgroundPosition: `-100% -100%`
		});

		temp.push({
			id: 5,
			correctIndex: 5,
			currentIndex: 5,
			backgroundPosition: `-50% -100%`
		});

		temp.push({
			id: 6,
			correctIndex: 6,
			currentIndex: 6,
			backgroundPosition: `0% -50%`
		});

		temp.push({
			id: 7,
			correctIndex: 7,
			currentIndex: 7,
			backgroundPosition: `-100% -50%`
		});

		temp.push({
			id: 8,
			correctIndex: 8,
			currentIndex: 8,
			backgroundPosition: `-50% -50%`
		});

    	this.pieces = this.shuffle(temp);
  	}

  	shuffle(array: PuzzlePiece[]) {
		return array
			.map(v => ({ v, r: Math.random() }))
			.sort((a, b) => a.r - b.r)
			.map(a => a.v)
			.map((p, index) => ({
				...p,
				currentIndex: index
			}));
  	}

 	 drop(event: CdkDragDrop<PuzzlePiece[]>) {
		if (this.solved) return;

		const dropPoint = event.dropPoint;
		if (!dropPoint) return;

		const rect = (event.container.element.nativeElement as HTMLElement)
			.getBoundingClientRect();

		const x = dropPoint.x - rect.left;
		const y = dropPoint.y - rect.top;

		const toIndex = this.getIndexFromPosition(x, y);

		if (toIndex < 0 || toIndex >= this.pieces.length) return;

	    const draggedPiece = event.item.data as PuzzlePiece;

	    const fromIndex = draggedPiece.currentIndex;

    	if (fromIndex === toIndex) return;

		const targetPiece = this.pieces[toIndex];

		this.pieces[toIndex] = draggedPiece;
		this.pieces[fromIndex] = targetPiece;

		draggedPiece.currentIndex = toIndex;
		targetPiece.currentIndex = fromIndex;

		this.checkSolved();
  	}


 	getIndexFromPosition(x: number, y: number): number {
		const grid = 3;
		const size = 500;
		const cell = size / grid;

		const col = Math.floor(x / cell);
		const row = Math.floor(y / cell);

		return row * grid + col;
  	}

	isSolved(): boolean {
		return this.pieces.every(
			(piece, index) => piece.correctIndex === piece.currentIndex
		);
	}

	checkSolved() {
		if (this.isSolved()) {
			this.solved = true;
			this.showGiftChooser = true;
		}
	}

	shuffleGifts() {
		this.giftOptions = this.giftOptions
			.map(v => ({ ...v, r: Math.random() }))
			.sort((a, b) => a.r - b.r)
			.map(({ r, ...rest }) => rest);
	}

	chooseGift(gift: GiftOption) {
		if (this.selectedGift) return;
		this.selectedGift = gift;
		this.showGiftChooser = false;
		this.showFinalGift = true;
	}

	nextPage() {
		const giftId = this.route.snapshot.paramMap.get('giftId');
		this.router.navigate([giftId, 'message']);
	}
}
