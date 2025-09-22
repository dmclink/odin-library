/** Book represents a book the user has submitted to their library.
 *
 * @param {string} title - the title of the book to add
 * @param {string} author - the author's name of the new book
 * @param {number} pages - the number of pages
 * @param {boolean} read - whether or not the user has read the book
 */
class Book {
	constructor(title, author, pages, read) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}
}

class Library {
	#libkey = 'mylib';
	#myLibrary = [];

	constructor() {
		const myLibJSON = localStorage.getItem(this.#libkey);
		if (myLibJSON !== null) {
			this.#myLibrary = JSON.parse(localStorage.getItem(this.#libkey));
		}
	}

	setBooksLocalStorage() {
		localStorage.setItem(this.#libkey, JSON.stringify(this.#myLibrary));
	}

	static createTrashcanSvg() {
		const svgNS = 'http://www.w3.org/2000/svg';

		const trashcan = document.createElementNS(svgNS, 'svg');
		trashcan.setAttribute('viewbox', '0 0 24 24');
		trashcan.setAttribute('width', '24');
		trashcan.setAttribute('height', '24');

		const pathData =
			'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';
		const trashcanPath = document.createElementNS(svgNS, 'path');
		trashcanPath.setAttribute('d', pathData);

		trashcan.appendChild(trashcanPath);

		return trashcan;
	}

	/** Creates a new book from form inputs and appends it to myLibrary array. */
	addBookToLibrary() {
		const form = document.querySelector('#dialog__form');
		const formData = new FormData(form);
		const newBook = new Book(
			formData.get('new-title'),
			formData.get('new-author'),
			formData.get('new-pages'),
			formData.get('new-read')
		);

		this.#myLibrary.push(newBook);
		this.setBooksLocalStorage();
	}

	/** Searches myLibrary for the book with the same same id as input.
	 * ASSUME: book exists in library
	 *
	 * @param {string} id - id of book to search
	 * @returns {number} - the index in myLibrary where book with id was found */
	findBookIndex(id) {
		return this.#myLibrary.findIndex((book) => book.id === id);
	}

	/** Removes book with id from myLibrary array and deletes its index from indexes */
	removeBookFromLibrary(id) {
		const idx = this.findBookIndex(id);
		this.#myLibrary.splice(idx, 1);
		this.setBooksLocalStorage();
	}

	/** Creates a book card div element from given Book data.
	 *
	 * Example Element:
	 * <div class="book-card">
	 *  <div class="book-card__header">
	 *    <h3 class="book-card__title capitalize">Murder on the Orient Express</h3>
	 *    <button class="book-card__delete-btn"><svg>trashcan</svg></button>
	 *  </div>
	 *  <p class="book-card__author">by <span class="capitalize">Agatha Christie<span></p>
	 *  <p class"book-card__pages">256 pages</p>
	 *  <p class="book-card__read" data-read="false">not read</p>
	 * </div>
	 *
	 * @param {Book} book - the Book data to use to create the new book element
	 * @returns {HTMLElement} - the newly created book card */
	createBookEl(book) {
		const bookCard = document.createElement('div');
		bookCard.classList.add('book-card');

		const bookCardHeader = document.createElement('div');
		bookCardHeader.classList.add('book-card__header');

		const title = document.createElement('h3');
		title.textContent = book.title;
		title.classList.add('book-card__title', 'capitalize');

		const deleteButton = document.createElement('button');
		deleteButton.classList.add('book-card__delete-btn');
		console.log(this);
		const deleteSvg = Library.createTrashcanSvg();
		deleteSvg.classList.add('book-card__delete-svg');
		deleteButton.appendChild(deleteSvg);
		deleteButton.addEventListener('click', () => {
			console.log('myLibrary before:', this.#myLibrary);
			deleteButton.parentElement.parentElement.remove();
			this.removeBookFromLibrary(book.id);
			console.log('myLibrary after:', this.#myLibrary);
		});

		const author = document.createElement('p');
		const attr = document.createTextNode('by ');
		const auth = document.createElement('span');
		auth.textContent = book.author;
		auth.classList.add('capitalize');
		author.appendChild(attr);
		author.appendChild(auth);
		author.classList.add('book-card__author');

		const pages = document.createElement('p');
		pages.textContent = `${book.pages} pages`;
		pages.classList.add('book-card__pages');

		const read = document.createElement('p');
		const readAttr = 'data-read';
		read.textContent = book.read;
		if (book.read === 'read') {
			read.setAttribute(readAttr, 'true');
		} else {
			read.setAttribute(readAttr, 'false');
		}
		read.classList.add('book-card__read');
		read.addEventListener('click', () => {
			const isTrueSet = read.getAttribute(readAttr) === 'true';
			const newReadValue = !isTrueSet;
			read.setAttribute(readAttr, String(newReadValue));
			const idx = this.findBookIndex(book.id);
			const newReadText = newReadValue ? 'read' : 'not read';
			this.#myLibrary[idx].read = newReadText;
			read.textContent = newReadText;
			this.setBooksLocalStorage();
		});

		bookCardHeader.appendChild(title);
		bookCardHeader.appendChild(deleteButton);

		bookCard.appendChild(bookCardHeader);
		bookCard.appendChild(author);
		bookCard.appendChild(pages);
		bookCard.appendChild(read);

		return bookCard;
	}

	/** Creates a book element for every book in myLibrary and populates the #books HTML list */
	displayBooks() {
		const bookCardsEl = document.querySelector('#books');
		bookCardsEl.replaceChildren();
		this.#myLibrary.forEach((book) => {
			const bookEl = this.createBookEl(book);
			bookCardsEl.appendChild(bookEl);
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// getBooksLocalStorage();
	const myLibrary = new Library();
	myLibrary.displayBooks();

	const form = document.querySelector('#dialog__form');
	const dialog = document.querySelector('#dialog');

	dialog.addEventListener('close', () => {
		form.reset();
		form.querySelector('#new-read').checked = true;
	});

	const openDialogBtn = document.querySelector('#open-dialog-btn');
	openDialogBtn.addEventListener('click', () => {
		dialog.showModal();
	});

	const closeDialogBtn = document.querySelector('#close-dialog-btn');
	closeDialogBtn.addEventListener('click', () => {
		dialog.close();
	});

	const pagesRange = document.querySelector('#new-pages');
	const pagesOutput = document.querySelector('#new-pages-output');
	pagesRange.addEventListener('input', () => {
		pagesOutput.value = pagesRange.value;
	});

	document.querySelector('#form-submit-btn').addEventListener('click', (e) => {
		e.preventDefault();
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		myLibrary.addBookToLibrary();
		myLibrary.displayBooks();
		form.reset();
		form.querySelector('#new-read').checked = true;
		dialog.close();
	});
});
