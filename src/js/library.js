const myLibrary = [];

function createTrashcanSvg() {
	const svgNS = 'http://www.w3.org/2000/svg';

	const trashcan = document.createElementNS(svgNS, 'svg');
	trashcan.setAttribute('viewbox', '0 0 24 24');

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
	const form = document.querySelector('#add-new-form');
	const formData = new FormData(form);
	const newBook = new Book(
		formData.get('new-title'),
		formData.get('new-author'),
		formData.get('new-pages'),
		formData.get('new-read')
	);

	myLibrary.push(newBook);
}

/** Removes book with id from myLibrary array and deletes its index from indexes
 *
 */
function removeBookFromLibrary(id) {
	const idx = myLibrary.findIndex((book) => book.id === id);
	myLibrary.splice(idx, 1);
}

/** Creates a book card div element from given Book data.
 *
 * Example Element:
 * <div class="book-card">
 *  <h3 class="book-card__title">Murder on the Orient Express</h3>
 *  <p class="book-card__author">by Agatha Christie</p>
 *  <p class"book-card__pages">256 pages</p>
 *  <p class="book-card__read">not read</p>
 * </div>
 *
 * @param {Book} book - the Book data to use to create the new book element
 * @returns {HTMLElement} - the newly created book card
 */
function createBookEl(book) {
	const bookCard = document.createElement('div');
	bookCard.classList.add('book-card');

	const title = document.createElement('h3');
	title.textContent = book.title;
	title.classList.add('book-card__title');

	const author = document.createElement('p');
	author.textContent = `by ${book.author}`;
	author.classList.add('book-card__author');

	const pages = document.createElement('p');
	pages.textContent = `${book.pages} pages`;
	pages.classList.add('book-card__pages');

	const read = document.createElement('p');
	read.textContent = book.read;
	read.classList.add('book-card__read');

	const deleteButton = document.createElement('button');
	deleteButton.classList.add('book-card__delete');
	const deleteSvg = createTrashcanSvg();
	deleteButton.appendChild(deleteSvg);
	deleteButton.addEventListener('click', () => {
		console.log('myLibrary before:', myLibrary);
		deleteButton.parentElement.remove();
		removeBookFromLibrary(book.id);
		console.log('myLibrary after:', myLibrary);
	});

	bookCard.appendChild(title);
	bookCard.appendChild(deleteButton);
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
	displayBooks();

	const form = document.querySelector('#add-new-form');
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
