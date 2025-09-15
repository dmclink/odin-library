let myLibrary = [];

const libkey = 'mylib';

function getBooksLocalStorage() {
	const myLibJSON = localStorage.getItem(libkey);
	if (myLibJSON !== null) {
		myLibrary = JSON.parse(localStorage.getItem(libkey));
	}
}

function setBooksLocalStorage() {
	localStorage.setItem(libkey, JSON.stringify(myLibrary));
}

function createTrashcanSvg() {
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

/** Book represents a book the user has submitted to their library.
 *
 * @param {string} title - the title of the book to add
 * @param {string} author - the author's name of the new book
 * @param {number} pages - the number of pages
 * @param {boolean} read - whether or not the user has read the book
 */
function Book(title, author, pages, read) {
	if (!new.target) {
		throw new TypeError("Book constructor must be called with 'new'");
	}

	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

/** Creates a new book from form inputs and appends it to myLibrary array.
 */
function addBookToLibrary() {
	const form = document.querySelector('#dialog__form');
	const formData = new FormData(form);
	const newBook = new Book(
		formData.get('new-title'),
		formData.get('new-author'),
		formData.get('new-pages'),
		formData.get('new-read')
	);

	myLibrary.push(newBook);
	setBooksLocalStorage();
}

/** Removes book with id from myLibrary array and deletes its index from indexes
 *
 */
function removeBookFromLibrary(id) {
	const idx = myLibrary.findIndex((book) => book.id === id);
	myLibrary.splice(idx, 1);
	setBooksLocalStorage();
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
 * @returns {HTMLElement} - the newly created book card
 */
function createBookEl(book) {
	const bookCard = document.createElement('div');
	bookCard.classList.add('book-card');

	const bookCardHeader = document.createElement('div');
	bookCardHeader.classList.add('book-card__header');

	const title = document.createElement('h3');
	title.textContent = book.title;
	title.classList.add('book-card__title', 'capitalize');

	const deleteButton = document.createElement('button');
	deleteButton.classList.add('book-card__delete-btn');
	const deleteSvg = createTrashcanSvg();
	deleteSvg.classList.add('book-card__delete-svg');
	deleteButton.appendChild(deleteSvg);
	deleteButton.addEventListener('click', () => {
		console.log('myLibrary before:', myLibrary);
		deleteButton.parentElement.parentElement.remove();
		removeBookFromLibrary(book.id);
		console.log('myLibrary after:', myLibrary);
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
	read.textContent = book.read;
	if (book.read === 'read') {
		read.setAttribute('data-read', 'true');
	} else {
		read.setAttribute('data-read', 'false');
	}
	read.classList.add('book-card__read');
	read.addEventListener('click', () => {
		// TODO: add read toggle
		console.log('read book');
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
function displayBooks() {
	const bookCardsEl = document.querySelector('#books');
	bookCardsEl.replaceChildren();
	myLibrary.forEach((book) => {
		const bookEl = createBookEl(book);
		bookCardsEl.appendChild(bookEl);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	getBooksLocalStorage();
	displayBooks();

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
		addBookToLibrary();
		displayBooks();
		form.reset();
		form.querySelector('#new-read').checked = true;
		dialog.close();
	});
});
