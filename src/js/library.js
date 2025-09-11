const myLibrary = [];

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

function displayBooks() {
	// TODO: grab some element from the DOM and fill it in with all the books in `myLibrary`
}

document.addEventListener('DOMContentLoaded', () => {
	const dialog = document.querySelector('#dialog');
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
		addBookToLibrary();
	});
});
